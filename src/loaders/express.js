const express = require("express");
const cors = require("cors");
const logger = require("morgan");

function connectServer(app) {
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: [process.env.CLIENT_HOST],
      methods: "GET, POST",
      preflightContinue: true,
    }),
  );
}

module.exports = connectServer;
