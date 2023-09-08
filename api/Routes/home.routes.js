const express = require("express");
const Router = express.Router();

const homeController = require("../Controllers/home.controller");
//majd az auth check eknél kell
const authMiddleware = require("../Middlewares/auth.middleware.js");

Router.get("/getRents/:user", homeController.getRents);
Router.get("/getCars", homeController.getCars);
Router.get("/getCar/:id", homeController.getCar);
Router.post("/rentCar", homeController.rentCar);
Router.post("/toZero", homeController.toZero);
Router.post("/AddMoney", homeController.AddMoney);
Router.post("/stopRent", homeController.stopRent);
module.exports = Router;
