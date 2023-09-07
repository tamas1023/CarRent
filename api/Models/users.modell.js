const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./connection.modell");
require("dotenv").config();
class Users extends Model {}
Users.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    UserName: DataTypes.STRING,
    Password: DataTypes.STRING,
    Email: DataTypes.STRING,
    Money: DataTypes.INTEGER,
    RegDate: DataTypes.DATE,
    RightsId: DataTypes.INTEGER,
    State: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);
module.exports = Users;
