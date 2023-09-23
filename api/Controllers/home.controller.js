const sequelize = require("../Models/connection.modell");
const Cars = require("../Models/cars.modell");
const Rents = require("../Models/rents.modell");
const { where } = require("sequelize");
const Users = require("../Models/users.modell");
const History = require("../Models/history.modell");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const { dateToString } = require("../Services/date.service");
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
const {
  lengthCheck,
  numberCheck,
  lowerUpperCheck,
} = require("../Services/pass.service");
exports.userUpdate = async (req, res) => {
  const t = await sequelize.transaction();

  const { UserName, OldUserName, Password, Password2, Email, UserID } =
    req.body;
  const updateData = {};
  if (!UserName || !Email) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Missing username or email!",
    });
  }
  //ha nem vátozott a jelszó akkor ne csináljon semmit a jelszóval,
  //és ne frissítse a jelszót
  //megnézni, ha a név vagy email cím amit talát megeggyezik az ID jük, akkor az a változás
  //végbe menet, fülönben nem hajtódhat végre

  const emailCheck = await Users.findOne({ where: { Email: Email } });
  const userNameCheck = await Users.findOne({ where: { UserName: UserName } });

  if (userNameCheck) {
    if (userNameCheck.ID == UserID) {
      updateData.UserName = UserName;
    }
    //ha a 2 id megeggyezik akkor az ugyan az a felhasználó
  } else {
    //ha nem talált eggyezést
    updateData.UserName = UserName;
  }
  if (emailCheck) {
    if (emailCheck.ID == UserID) {
      updateData.Email = Email;
    }
  } else {
    updateData.Email = Email;
  }
  if (Password != "") {
    //console.log("Nem üres első jelszó");
    if (Password != Password2) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "The entered passwords do not match!",
      });
    }
    if (!lengthCheck(Password)) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "The entered password must be at least 8 characters long!",
      });
    }
    if (!numberCheck(Password)) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "The entered password must contain a number!",
      });
    }
    if (!lowerUpperCheck(Password)) {
      return res.send({
        success: false,
        msg: "The entered password must contain both upper and lower case letters!",
      });
    }
    const hashPassword = await bcrypt.hash(Password, 10);
    updateData.Password = hashPassword;
  }

  const updateUser = await Users.update(updateData, {
    where: {
      ID: UserID,
    },
    transaction: t,
  });

  if (!updateUser) {
    await t.rollback();
    return res.send({ success: false, msg: "Data modification error!" });
  }

  //A nevet kell frissíteni a history ban
  const updateHistory = await History.update(
    { UserName: UserName },
    {
      where: {
        UserName: OldUserName,
      },
      transaction: t,
    }
  );

  if (!updateHistory) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "History data modification error!",
    });
  }

  //a jelenlegi auth tokent le kell tiltani
  const { authtoken } = req.headers;
  const results = await sequelize.query(
    `INSERT INTO deniedtokens (token, date) VALUES ('${authtoken}','${dateToString(
      new Date()
    )}')`,
    QueryTypes.INSERT,
    { transaction: t }
  );

  if (!results) {
    await t.rollback();
    return res.send({ success: false, msg: "Token ban error!" });
  }
  //Új tokent kell generálni!!
  const token = await jwt.sign(
    { name: UserName },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "1h",
    }
  );
  if (!token) {
    return res.send({ success: false, msg: "Token error!" });
  }

  await t.commit();
  const updateDataLength = Object.keys(updateData).length;
  return res.set({ authtoken: token }).send({
    success: true,
    msg: `Successful data modification!`,
    user: UserName,
  });
  //return res.send({ success: true, msg: "Tesztelek" });
};
exports.getProfil = async (req, res) => {
  const { user } = req.params;

  const oneUser = await Users.findOne({
    where: {
      UserName: user,
    },
    attributes: {
      exclude: ["Password", "Money", "RegDate", "RightsId", "State"],
    },
  });

  if (!oneUser) {
    return res.send({ success: false, msg: "There is no such person!" });
  }

  return res.send({
    success: true,
    msg: "Successful requests",
    userData: oneUser,
  });
};
exports.getCars = async (req, res) => {
  const cars = await Cars.findAll({
    //attributes: ["ID"],
  });
  res.send(cars);
};
exports.getRents = async (req, res) => {
  const { user } = req.params;

  const rents = await Rents.findAll({
    where: {
      UserName: user,
    },
  });

  if (!rents) {
    return res.send({ success: false, msg: "No rented car!" });
  }
  // keresni olyan autókat, ami a rents.CarID val megeggyeznek
  //ha van 3 carID akkor neki 3 cars elemet kell visszaadni
  const carIDs = rents.map((rent) => rent.CarID);
  //itt a where ID azért műküdik mert tömböt adok át, amit a lekérdezésben az IN
  //parancs fog végrehajtódni, ami annyi tesz itt,hogy ha az ID eggyezik a CarIDs
  //valamelyikével, akkor megtalálja
  const cars = await Cars.findAll({
    where: {
      ID: carIDs,
    },
  });
  const money = await Users.findOne({
    where: {
      UserName: user,
    },
  });

  return res.send({
    success: true,
    msg: "Successful requests",
    Money: money.Money,
    Rents: rents,
    Cars: cars,
  });
};
exports.getCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Cars.findOne({
      where: {
        ID: id,
      },
    });

    if (!car) {
      return res.status(404).send({ success: false, msg: "No car found" });
    }

    res.send(car);
  } catch (error) {
    return res.status(500).send({ success: false, msg: "Server error" });
  }
};
exports.rentCar = async (req, res) => {
  const { CarID, UserName } = req.body;
  const t = await sequelize.transaction();
  try {
    const oneUser = await Users.findOne({
      where: {
        UserName: UserName,
      },
      attributes: {
        exclude: ["Password", "RegDate", "RightsId", "State"],
      },
    });
    if (!oneUser) {
      return res.send({ success: false, msg: "There is no such person!" });
    }
    if (oneUser.Money < 0) {
      return res.send({
        success: false,
        msg: "You don't have enough money to rent a car!",
      });
    }
    const insertRents = await Rents.create(
      { CarID: CarID, UserName: UserName, Date: new Date() },
      { transaction: t }
    );

    if (!insertRents) {
      await t.rollback();
      return res.send({ success: false, msg: "Car rental error!" });
    }
    //A car.Rented firssítése
    const updateCars = await Cars.update(
      { Rented: 1 },
      { where: { ID: CarID } }
    );

    if (!updateCars) {
      await t.rollback();
      return res.send({ success: false, msg: "Car modification error!" });
    }

    await t.commit();
    return res.send({ success: true, msg: "Successful car rental!" });
    //return res.send({ success: true, msg: "Tesztelek" });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error });
  }
};
exports.toZero = async (req, res) => {
  const { UserName } = req.body;
  const t = await sequelize.transaction();
  try {
    const updatedUser = await Users.update(
      { Money: 0 },
      {
        where: {
          UserName: UserName,
        },
      }
    );

    if (!updatedUser) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "Money update error!",
      });
    }
    await t.commit();
    return res.send({
      success: true,
      msg: "Successful money update!",
      Money: 0,
    });
    //return res.send({ success: true, msg: "Tesztelek" });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error });
  }
};
exports.AddMoney = async (req, res) => {
  const { UserName, Money } = req.body;
  const t = await sequelize.transaction();
  try {
    const updatedUser = await Users.update(
      { Money: Money },
      {
        where: {
          UserName: UserName,
        },
      }
    );

    if (!updatedUser) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "Money update error!",
      });
    }
    await t.commit();
    return res.send({
      success: true,
      msg: "Successful money update!",
    });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error });
  }
};

exports.stopRent = async (req, res) => {
  //pénzt levonni a dátum alapján
  //kitörölni a rents táblából az elemet, a car.rented átállítani 0 ra,
  //és a history hoz hozzáadni
  const {
    UserName,
    Money,
    CarID,
    startDate,
    currentDate,
    Value,
    Description,
    Image,
    CarName,
  } = req.body;
  const t = await sequelize.transaction();
  try {
    const updatedUser = await Users.update(
      { Money: Money },
      {
        where: {
          UserName: UserName,
        },
      }
    );

    if (!updatedUser) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "Money update error!",
      });
    }
    const deletedRent = await Rents.destroy({
      where: {
        CarID: CarID,
      },
    });
    if (!deletedRent) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "Rent deletion error!",
      });
    }
    const updatedCars = await Cars.update(
      { Rented: 0 },
      {
        where: {
          ID: CarID,
        },
      }
    );
    if (!updatedCars) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "Car modify error!",
      });
    }

    const insertHistory = await History.create(
      {
        CarID: CarID,
        UserName: UserName,
        CarName: CarName,
        Value: Value,
        Description: Description,
        Image: Image,
        StartDate: startDate,
        EndDate: currentDate,
      },
      { transaction: t }
    );
    if (!insertHistory) {
      await t.rollback();
      return res.send({
        success: false,
        msg: "History insertion error!",
      });
    }
    await t.commit();
    return res.send({
      success: true,
      msg: "Successfuly stoped renting!",
    });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error });
  }
};
