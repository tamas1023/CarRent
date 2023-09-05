const express = require("express");
const Router = express.Router();

const authController = require("../Controllers/auth.controller.js");
const authMiddleware = require("../Middlewares/auth.middleware.js");

//Router.get("/test", [authMiddleware.isAuth], authController.test);

Router.post("/carAdd", authController.carAdd);
module.exports = Router;
