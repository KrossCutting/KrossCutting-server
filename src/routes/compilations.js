const express = require("express");

const router = express.Router();

const progressStatus = require("./progressStatus");

const adjustAudio = require("../middlewares/adjustAudio");
const extractFrames = require("../middlewares/extractFrames");
const findEditPoints = require("../middlewares/findEditPoints");
const crossCuttingController = require("../controllers/crossCutting.controller");

router.post(
  "/",
  (req, res, next) => {
    progressStatus.stage = "start";

    next();
  },
  adjustAudio,
  extractFrames,
  findEditPoints,
  crossCuttingController,
);

router.get("/", (req, res) => {
  res.status(200).json(progressStatus.stage);
});

module.exports = router;
