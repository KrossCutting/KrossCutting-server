const express = require("express");

const router = express.Router();
const extractFrames = require("../middlewares/extractFrames");
const findEditPoints = require("../middlewares/findEditPoints");

// To Do. 교차 편집 컨트롤러 삽입 필요
router.post("/", extractFrames);

module.exports = router;
