const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./connection.modell");
require("dotenv").config();
class History extends Model {}
History.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    CarID: DataTypes.INTEGER,
    UserName: DataTypes.STRING,
    CarName: DataTypes.STRING,
    Value: DataTypes.INTEGER,
    Description: DataTypes.STRING,
    Image: DataTypes.STRING,
    StartDate: DataTypes.DATE,
    EndDate: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "history",
    timestamps: false,
  }
);
module.exports = History;
