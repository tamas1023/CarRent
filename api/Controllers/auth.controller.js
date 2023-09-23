const { where } = require("sequelize");
const Cars = require("../Models/cars.modell");
const sequelize = require("../Models/connection.modell");
const Users = require("../Models/users.modell");
const History = require("../Models/history.modell");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const { dateToString } = require("../Services/date.service");

const {
  lengthCheck,
  numberCheck,
  lowerUpperCheck,
} = require("../Services/pass.service");
exports.getHistory = async (req, res) => {
  const getHistory = await History.findAll({});
  return res.send(getHistory);
};
exports.userLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    //Beérkezett adatok vizsgálata
    if (!Email || !Password) {
      return res.send({
        success: false,
        msg: "You didn't provide all the information!",
      });
    }
    //Felhasználó lekérése
    const user = await Users.findOne({
      where: {
        Email: Email,
      },
    });

    if (!user) {
      return res.send({ success: false, msg: "Incorrect e-mail or password!" });
    }
    //Felhasználó jelszavának vizsgálata
    const isSame = await bcrypt.compare(Password, user.Password);

    if (!isSame) {
      return res.send({ success: false, msg: "Incorrect e-mail or password!" });
    }
    const token = await jwt.sign(
      { name: user.UserName },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    if (!token) {
      return res.send({ success: false, msg: "Token error!" });
    }
    return res.set({ authtoken: token }).send({
      success: true,
      msg: "Successful login!",
      username: user.UserName,
      userrights: user.RightsId,
    });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, msg: "Fatal Error! " + error });
  }
};
exports.userReg = async (req, res) => {
  //megnézni, hogy admin jog e, aztán lehet feltenni, de sql injekciót kezelni ha kell??
  const t = await sequelize.transaction();
  const { UserName, Password, Password2, Email } = req.body;
  if (!UserName || !Email) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Missing username or email!",
    });
  }
  //ha email címek eggyeznek
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
  const emailCheck = await Users.findOne({ where: { Email: Email } });
  const userNameCheck = await Users.findOne({ where: { UserName: UserName } });

  if (userNameCheck) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "This username is not available!",
    });
  }
  if (emailCheck) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "This e-mail is already registered!",
    });
  }

  const insertUser = await Users.create(
    {
      UserName: UserName,
      Password: hashPassword,
      Email: Email,
      Money: 0,
      RegDate: new Date(),
      //1 az felhasználó, 2 az admin
      RightsId: 1,
    },
    { transaction: t }
  );

  if (!insertUser) {
    await t.rollback();
    return res.send({ success: false, msg: "Registration error!" });
  }

  await t.commit();
  return res.send({ success: true, msg: "Successful registration!" });
  //return res.send({ success: true, msg: "Tesztelek" });
};
exports.carAdd = async (req, res) => {
  //megnézni, hogy admin jog e, aztán lehet feltenni, de sql injekciót kezelni ha kell??
  const t = await sequelize.transaction();
  const { Name, Value, Description, Image, Rented } = req.body;
  if (!Name || !Value) {
    await t.rollback();
    return res.send({ success: false, msg: "Missing car name or value!" });
  }
  const insertCar = await Cars.create(
    {
      Name: Name,
      Value: Value,
      Description: Description,
      Image: Image,
      Rented: Rented,
    },
    { transaction: t }
  );
  if (!insertCar) {
    await t.rollback();
    return res.send({ success: false, msg: "Car add error!" });
  }
  await t.commit();
  return res.send({ success: true, msg: "Successful car add!" });
};
exports.changeCar = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  const { Name, Value, Description, Image, Rented } = req.body;
  if (!Name || !Value) {
    await t.rollback();
    return res.send({ success: false, msg: "Missing car name or value!" });
  }
  const updateCar = await Cars.update(
    {
      Name: Name,
      Value: Value,
      Description: Description,
      Image: Image,
      Rented: Rented,
    },

    { transaction: t, where: { ID: id } }
  );
  if (!updateCar) {
    await t.rollback();
    return res.send({ success: false, msg: "Car modification error!" });
  }
  await t.commit();
  return res.send({ success: true, msg: "Successful Car modification!" });
};
exports.deleteCar = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const deleteCar = await Cars.destroy({
      where: {
        ID: id,
      },
      transaction: t,
    });
    //elvileg ha 0 sor került változtatásra
    if (deleteCar === 0) {
      await t.rollback();
      return res.send({ success: false, msg: "Car delete error!" });
    }
    await t.commit();
    return res.send({ success: true, msg: "Successful Car delete!" });
  } catch (error) {
    await t.rollback();
    return res.status(500).send({ success: false, msg: error.message });
  }
};
exports.authCheck = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { user } = req.body;
    const { authtoken } = req.headers;
    //Adatok vizsgálata
    if (!authtoken || !user) {
      await t.rollback();
      return res.send({ success: false, msg: "Missing data!" });
    }
    //Új Token létrehozása
    const token = await jwt.sign(
      { name: user.UserName },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );

    if (!token) {
      await t.rollback();
      return res.send({ success: false, msg: "Token error!" });
    }
    if (token != authtoken) {
      //Jelenlegi Token letiltása
      //console.log("2 nem egyezik");
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
    }

    await t.commit();
    return res.set({ authtoken: token }).send({ success: true, user: user });
  } catch (error) {
    return res.send({ success: false, msg: "Fatal Error! " + error });
  }
};
