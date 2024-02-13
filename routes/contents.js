const express = require("express");

const router = express.Router();

const upload = require("./controllers/upload.controller");
const uploadToLocal = require("../services/uploadToLocal");
const transferController = require("./controllers/transfer.controller");

router.post(
  "/files",
  uploadToLocal.fields([
    { name: "mainVideoFile" },
    { name: "subOneVideoFile" },
    { name: "subTwoVideoFile" },
  ]),
  upload,
);

router.post("/urls", transferController.transferMedia);

module.exports = router;
