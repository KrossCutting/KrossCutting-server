const express = require("express");

const router = express.Router();

const adjustAudio = require("../middlewares/adjustAudio");
const extractFrames = require("../middlewares/extractFrames");
const findEditPoints = require("../middlewares/findEditPoints");

router.post("/", adjustAudio, extractFrames, findEditPoints);

module.exports = router;
