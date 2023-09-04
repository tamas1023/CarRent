const express = require("express");
const Router = express.Router();

const homeController = require("../Controllers/home.controller");
const authMiddleware = require("../Middlewares/auth.middleware.js");

module.exports = Router;
