const express = require("express");

const router = express.Router();

const transferController = require("../controllers/transfer.controller");

router.post("/contents", transferController.transferMedia);

module.exports = router;
