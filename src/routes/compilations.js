const express = require("express");

const router = express.Router();

const progressStatus = require("./progressStatus");

const extractFrames = require("../middlewares/extractFrames");
const findEditPoints = require("../middlewares/findEditPoints");
const findVerticalEditPoints = require("../middlewares/findVerticalEditPoints");
const crossCuttingController = require("../controllers/crossCutting.controller");

router.post("/", extractFrames, findEditPoints, crossCuttingController);

// TODO. 세로영상의 경우 새롭게 엔드포인트를 생성하고 컨트롤러를 수정해야합니다.
// TODO. 아래는 세로 영상 mockup을 위한 컨트롤러 형태입니다.
/* router.post(
  "/",
  extractFrames,
  // findEditPoints,
  findVerticalEditPoints,
  crossCuttingController
); */

router.get("/", (req, res) => {
  res.status(200).json(progressStatus.stage);
});

module.exports = router;
