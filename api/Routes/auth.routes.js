const express = require("express");
const Router = express.Router();

const authController = require("../Controllers/auth.controller.js");
const authMiddleware = require("../Middlewares/auth.middleware.js");

//Router.get("/test", [authMiddleware.isAuth], authController.test);
Router.post("/userLogin", authController.userLogin);
Router.post("/userReg", authController.userReg);
Router.post("/carAdd", authController.carAdd);
Router.post("/changeCar/:id", authController.changeCar);
Router.post("/deleteCar/:id", authController.deleteCar);
Router.get("/getHistory", authController.getHistory);
Router.post("/authCheck", authMiddleware.isAuth, authController.authCheck);
module.exports = Router;
