const Cars = require("../Models/cars.modell");

exports.authCheck = async (req, res) => {
  console.log("authCheck");
  res.send({ message: "authCheck" });
};
exports.test = async (req, res) => {
  const cars = await Cars.findAll({
    //attributes: ["ID"],
  });
  //console.log(cars);
  res.send(cars);
};
