const Cars = require("../Models/cars.modell");

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
