const express = require("express");

const router = express.Router();

const progressStatus = require("./progressStatus");

const adjustAudio = require("../middlewares/adjustAudio");
const extractFrames = require("../middlewares/extractFrames");
const findEditPoints = require("../middlewares/findEditPoints");
const findVerticalEditPoints = require("../middlewares/findVerticalEditPoints");
const crossCuttingController = require("../controllers/crossCutting.controller");
const crossCuttingVerticalController = require("../controllers/crossCuttingVertical.controller");

router.post("/", extractFrames, findEditPoints, crossCuttingController);

router.post(
  "/vertical",
  adjustAudio,
  extractFrames,
  findVerticalEditPoints,
  crossCuttingVerticalController,
);

router.get("/", (req, res) => {
  res.status(200).json(progressStatus.stage);
});

module.exports = router;
