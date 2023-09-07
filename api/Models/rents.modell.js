const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./connection.modell");
require("dotenv").config();
class Rents extends Model {}
Rents.init(
  {
    CarID: { type: DataTypes.INTEGER, primaryKey: true },
    UserName: DataTypes.STRING,
    Date: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "rents",
    timestamps: false,
  }
);
module.exports = Rents;
