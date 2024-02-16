const express = require("express");

const router = express.Router();

const adjustAudio = require("../middlewares/adjustAudio");
const extractFrames = require("../middlewares/extractFrames");
const findEditPoints = require("../middlewares/findEditPoints");

const progressStatus = require("./progressStatus");

router.post(
  "/",
  (req, res, next) => {
    progressStatus.stage = "start";

    next();
  },
  adjustAudio,
  extractFrames,
  findEditPoints,
  // TODO. 아래 내용에 컨트롤러가 위치해야합니다.
  // 컨트롤러 연결시 progressStatus.stage = "completed";가 들어가야 합니다.
  /* (req, res, next) => {
    progressStatus.stage = "completed";
    next();
  } */
);

router.get("/", (req, res) => {
  res.status(200).json(progressStatus.stage);
});

module.exports = router;
