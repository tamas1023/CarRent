const sequelize = require("../Models/connection.modell");
const Cars = require("../Models/cars.modell");
const Rents = require("../Models/rents.modell");
const { where } = require("sequelize");
const Users = require("../Models/users.modell");
const History = require("../Models/history.modell");

exports.getCars = async (req, res) => {
  
  const cars = await Cars.findAll({
    //attributes: ["ID"],
  });
  //console.log(cars);
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
    return res.send({ success: false, msg: "Nincs bérelt autó!" });
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
    msg: "Sikeres lekérések",
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
      //res.status(404).json({ error: "Autó nem található" });
      return res
        .status(404)
        .send({ success: false, msg: "Autó nem található" });
    }

    res.send(car);
  } catch (error) {
    //console.error("Hiba történt:", error);
    //res.status(500).json({ error: "Szerverhiba" });

    return res.status(500).send({ success: false, msg: "Szerverhiba" });
  }
};
exports.rentCar = async (req, res) => {
  const { CarID, UserName, CurDate } = req.body;
  //console.log(req.body);
  const t = await sequelize.transaction();
  try {
    const insertRents = await Rents.create(
      { CarID: CarID, UserName: UserName, Date: new Date() },
      { transaction: t }
    );

    if (!insertRents) {
      await t.rollback();
      return res.send({ success: false, msg: "Autóbérlés hiba!" });
    }

    const updateCars = await Cars.update(
      { Rented: 1 },
      { where: { ID: CarID } }
    );

    if (!updateCars) {
      await t.rollback();
      return res.send({ success: false, msg: "Autómódosítás hiba!" });
    }

    //A car.Rented firssítése

    await t.commit();
    return res.send({ success: true, msg: "Sikeres autóbérlés!!" });
    //return res.send({ success: true, msg: "Tesztelek" });
  } catch (error) {
    //console.error("Hiba történt:", error);
    //res.status(500).json({ error: "Szerverhiba" });
    //console.error("Hiba történt:", error);
    //console.error("Hiba történt:", error.message);
    return res.status(500).send({ success: false, msg: error });
  }
};
exports.toZero = async (req, res) => {
  const { UserName } = req.body;
  //console.log(req.body);
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
        msg: "Pénz frissítés hiba!",
      });
    }
    await t.commit();
    return res.send({
      success: true,
      msg: "Sikeres pénz frissítés!",
      Money: 0,
    });
    //return res.send({ success: true, msg: "Tesztelek" });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error });
  }
};
exports.AddMoney = async (req, res) => {
  const { UserName, Money } = req.body;
  //console.log(req.body);
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
        msg: "Pénz frissítés hiba!",
      });
    }
    await t.commit();
    return res.send({
      success: true,
      msg: "Sikeres pénz frissítés!",
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
  //console.log(req.body.CarID);
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
        msg: "Pénz frissítés hiba!",
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
        msg: "Rent törlés hiba!",
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
        msg: "Autó módosítani hiba!",
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
        msg: "History beszúrás hiba!",
      });
    }
    await t.commit();
    return res.send({
      success: true,
      msg: "Sikeres bérlés megszűntetés!",
    });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error });
  }
};
