const express = require("express");
const cors = require("cors");
const logger = require("morgan");

function connectServer(app) {
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: [process.env.CLIENT_HOST, process.env.SERVER_HOST],
      methods: "GET, POST",
      credentials: true,
      preflightContinue: true,
    }),
  );
}

module.exports = connectServer;
