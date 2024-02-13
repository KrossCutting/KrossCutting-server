const express = require("express");

const router = express.Router();

const upload = require("./controllers/upload.controller");
const uploadToLocal = require("../services/uploadToLocal");
const transferController = require("./controllers/transfer.controller");

router.post(
  "/contents/files",
  uploadToLocal.fields([
    { name: "mainVideoFile" },
    { name: "subOneVideoFile" },
    { name: "subTwoVideoFile" },
  ]),
  upload,
);

router.post("/contents/urls", transferController.transferMedia);

module.exports = router;
