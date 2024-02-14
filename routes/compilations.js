const express = require("express");

const router = express.Router();

const adjustAudio = require("../src/middlewares/adjustAudio");

router.post("/", adjustAudio);

module.exports = router;
