const express = require("express");
const Router = express.Router();

const authController = require("../Controllers/auth.controller.js");
const authMiddleware = require("../Middlewares/auth.middleware.js");

Router.get("/teszt", [authMiddleware.isAuth], authController.test);

module.exports = Router;
