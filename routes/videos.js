const express = require("express");

const router = express.Router();

const transferController = require("./controllers/transfer.controller");

router.post("/", transferController.transferMedia);

module.exports = router;
