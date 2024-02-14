const express = require("express");

const router = express.Router();

const uploadController = require("./controllers/upload.controller");
const uploadToLocal = require("../services/uploadToLocal");
const transferController = require("./controllers/transfer.controller");

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
