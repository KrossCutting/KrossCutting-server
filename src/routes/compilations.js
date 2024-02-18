const express = require("express");

const router = express.Router();

const progressStatus = require("./progressStatus");

const extractFrames = require("../middlewares/extractFrames");
const findEditPoints = require("../middlewares/findEditPoints");
const crossCuttingController = require("../controllers/crossCutting.controller");

router.post("/", extractFrames, findEditPoints, crossCuttingController);

router.get("/", (req, res) => {
  res.status(200).json(progressStatus.stage);
});

module.exports = router;
