const express = require("express");
const Router = express.Router();

const homeController = require("../Controllers/home.controller");
const authMiddleware = require("../Middlewares/auth.middleware.js");

Router.post("/userUpdate", authMiddleware.isAuth, homeController.userUpdate);
Router.get("/getProfil/:user", homeController.getProfil);
Router.get("/getRents/:user", authMiddleware.isAuth, homeController.getRents);
Router.get("/getCars", homeController.getCars);
Router.get("/getCar/:id", homeController.getCar);
Router.post("/rentCar", authMiddleware.isAuth, homeController.rentCar);
Router.post("/toZero", authMiddleware.isAuth, homeController.toZero);
Router.post("/AddMoney", authMiddleware.isAuth, homeController.AddMoney);
Router.post("/stopRent", authMiddleware.isAuth, homeController.stopRent);
module.exports = Router;
