require("dotenv").config();
const express = require("express");

const app = express();

const connectServer = require("./src/loaders/express");
const connectRouters = require("./src/loaders/routes");
const connectErrorMiddleware = require("./src/loaders/error");

connectServer(app);
connectRouters(app);
connectErrorMiddleware(app);

module.exports = app;
