const path = require("path");
const multer = require("multer");
const ensureDir = require("../util/ensureDir");
const { TEMP_DIR_VIDEOS } = require("../constants/paths");

const uploadToLocal = multer({
  storage: multer.diskStorage({
    destination: async (req, file, done) => {
      let destinationPath = "";

      switch (file.fieldname) {
        case "mainVideoFile":
          destinationPath = TEMP_DIR_VIDEOS.MAIN;
          break;

        case "subOneVideoFile":
          destinationPath = TEMP_DIR_VIDEOS.SUB_ONE;
          break;

        case "subTwoVideoFile":
          destinationPath = TEMP_DIR_VIDEOS.SUB_TWO;
          break;

        default:
          throw new Error(`Unknown fileName: ${file.fieldname}`);
      }

      await ensureDir(destinationPath);
      done(null, destinationPath);
    },
    filename(req, file, done) {
      let fileName = "";

      switch (file.fieldname) {
        case "mainVideoFile":
          fileName = "main-video";
          break;

        case "subOneVideoFile":
          fileName = "sub-one-video";
          break;

        case "subTwoVideoFile":
          fileName = "sub-two-video";
          break;

        default:
          throw new Error(`Unknown fileName: ${file.fieldname}`);
      }

      const ext = path.extname(file.originalname);

      done(null, fileName + ext);
    },
  }),
});

module.exports = uploadToLocal;
