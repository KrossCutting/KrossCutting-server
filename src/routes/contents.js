const express = require("express");

const router = express.Router();

const uploadController = require("../controllers/upload.controller");
const transferController = require("../controllers/transfer.controller");
const uploadToLocal = require("../services/uploadToLocal");

router.post(
  "/files",
  uploadToLocal.fields([
    { name: "mainVideoFile" },
    { name: "subOneVideoFile" },
    { name: "subTwoVideoFile" },
  ]),
  uploadController,
);

router.post("/urls", transferController);

module.exports = router;
