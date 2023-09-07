const { where } = require("sequelize");
const Cars = require("../Models/cars.modell");
const sequelize = require("../Models/connection.modell");
const Users = require("../Models/users.modell");
const bcrypt = require("bcrypt");
const {
  lengthCheck,
  numberCheck,
  lowerUpperCheck,
} = require("../Services/pass.service");

exports.authCheck = async (req, res) => {
  console.log("authCheck");
  res.send({ message: "authCheck" });
};
/*
exports.test = async (req, res) => {
  const cars = await Cars.findAll({
    //attributes: ["ID"],
  });
  //console.log(cars);
  res.send(cars);
};
*/
exports.userLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    //Beérkezett adatok vizsgálata
    if (!Email || !Password) {
      return res.send({ success: false, msg: "Nem adtál meg minden adatot!" });
    }

    //Felhasználó lekérése
    const user = await Users.findOne({
      where: {
        Email: Email,
      },
    });

    if (!user) {
      return res.send({ success: false, msg: "Hibás email vagy jelszó!" });
    }

    //Felhasználó jelszavának vizsgálata
    const isSame = await bcrypt.compare(Password, user.Password);

    if (!isSame) {
      return res.send({ success: false, msg: "Hibás email vagy jelszó!" });
    }
    return res.send({
      success: true,
      msg: "Sikeres bejelentkezés!",
      username: user.UserName,
    });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, msg: "Fatal Error!" });
  }
};
exports.userReg = async (req, res) => {
  //megnézni, hogy admin jog e, aztán lehet feltenni, de sql injekciót kezelni ha kell??
  //console.log("Ide bejött!!");
  //console.log(req.body);
  //console.log(new Date());
  const t = await sequelize.transaction();
  const { UserName, Password, Password2, Email } = req.body;
  if (!UserName || !Email) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Hiányzó felhasználónév vagy email!",
    });
  }
  //ha email címek eggyeznek
  if (Password != Password2) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "A megadott jelszavak nem egyeznek!",
    });
  }
  if (!lengthCheck(Password)) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "A megadott jelszónak min. 8 karakternek kell lennie!",
    });
  }
  if (!numberCheck(Password)) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "A megadott jelszónak tartalmaznia kell számot!",
    });
  }
  if (!lowerUpperCheck(Password)) {
    return res.send({
      success: false,
      msg: "A megadott jelszónak tartalmaznia kell kis- és nagybetűket is!",
    });
  }
  const hashPassword = await bcrypt.hash(Password, 10);
  const emailCheck = await Users.findOne({ where: { Email: Email } });
  const userNameCheck = await Users.findOne({ where: { UserName: UserName } });

  if (userNameCheck) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Ezzel a felhasználó névvel már regisztráltak!",
    });
  }
  if (emailCheck) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Ezzel az email címmel már regisztráltak!",
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
    return res.send({ success: false, msg: "Regisztrációs hiba!" });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres regisztráció!" });
  //return res.send({ success: true, msg: "Tesztelek" });
};
exports.carAdd = async (req, res) => {
  //megnézni, hogy admin jog e, aztán lehet feltenni, de sql injekciót kezelni ha kell??
  //console.log("Ide bejött!!");
  //console.log(req.body);

  const t = await sequelize.transaction();
  const { Name, Value, Description, Image, Rented } = req.body;
  if (!Name || !Value) {
    await t.rollback();
    return res.send({ success: false, msg: "Hiányzó autónév vagy érték!" });
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
    return res.send({ success: false, msg: "Autófelvétel hiba!" });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres autó felvétel!" });
  //return res.send({ success: true, msg: "Tesztelek" });
};
exports.changeCar = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  const { Name, Value, Description, Image, Rented } = req.body;
  if (!Name || !Value) {
    await t.rollback();
    return res.send({ success: false, msg: "Hiányzó autónév vagy érték!" });
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
    return res.send({ success: false, msg: "Autómódosítás hiba!" });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres autó módosítás!" });
  //return res.send({ success: true, msg: "Tesztelek" });
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
      return res.send({ success: false, msg: "Autótörlés hiba!" });
    }
    await t.commit();
    return res.send({ success: true, msg: "Sikeres autó törlés!" });
  } catch (error) {
    //console.error("Hiba történt:", error);
    //res.status(500).json({ error: "Szerverhiba" });
    await t.rollback();
    return res.status(500).send({ success: false, msg: error.message });
  }
};
