const sequelize = require("../Models/connection.modell");
const Cars = require("../Models/cars.modell");
const Rents = require("../Models/rents.modell");
const { where } = require("sequelize");

exports.getCars = async (req, res) => {
  const cars = await Cars.findAll({
    //attributes: ["ID"],
  });
  //console.log(cars);
  res.send(cars);
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
