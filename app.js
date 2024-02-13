require("dotenv").config();
const express = require("express");

const app = express();

const connectServer = require("./loaders/express");
const connectRouters = require("./loaders/routes");
const connectErrorMiddleware = require("./loaders/error");

connectServer(app);
connectRouters(app);
connectErrorMiddleware(app);

module.exports = app;
