const express = require("express");

const router = express.Router();

const adjustAudio = require("../middlewares/adjustAudio");

router.post("/audios", adjustAudio);

module.exports = router;
