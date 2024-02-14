const express = require("express");

const router = express.Router();

const adjustAudio = require("../middleware/adjustAudio");

router.post("/", adjustAudio);

module.exports = router;
