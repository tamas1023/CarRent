const express = require("express");
const Router = express.Router();

const homeController = require("../Controllers/home.controller");
const authMiddleware = require("../Middlewares/auth.middleware.js");

Router.get("/getCars", homeController.getCars);
Router.get("/getCar/:id", homeController.getCar);

module.exports = Router;
