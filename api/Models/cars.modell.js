const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./connection.modell");
require("dotenv").config();
class Cars extends Model {}
Cars.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Name: DataTypes.STRING,
    Value: DataTypes.INTEGER,
    Description: DataTypes.STRING,
    Image: DataTypes.STRING,
    Rented: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: "cars",
    timestamps: false,
  }
);
module.exports = Cars;
