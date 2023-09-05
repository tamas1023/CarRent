const Cars = require("../Models/cars.modell");
const sequelize = require("../Models/connection.modell");

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
