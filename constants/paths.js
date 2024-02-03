const path = require("path");

exports.S3_DIR = {
  VIDEOS: {
    MAIN: path.join(__dirname, "../temp/videos/main/"),
    SUB_ONE: path.join(__dirname, "../temp/videos/sub-one"),
    SUB_TWO: path.join(__dirname, "../temp/videos/sub-two"),
  },
  AUDIOS: {
    MAIN: path.join(__dirname, "../temp/audios/main/"),
    SUB_ONE: path.join(__dirname, "../temp/audios/sub-one"),
    SUB_TWO: path.join(__dirname, "../temp/audios/sub-two"),
  },
};
