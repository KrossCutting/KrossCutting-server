const path = require("path");

const TEMP_DIR_VIDEOS = {
  MAIN: path.join(__dirname, "../temp/videos/main/"),
  SUB_ONE: path.join(__dirname, "../temp/videos/sub-one"),
  SUB_TWO: path.join(__dirname, "../temp/videos/sub-two"),
};

const TEMP_DIR_AUDIOS = {
  MAIN: path.join(__dirname, "../temp/audios/main/"),
  SUB_ONE: path.join(__dirname, "../temp/audios/sub-one"),
  SUB_TWO: path.join(__dirname, "../temp/audios/sub-two"),
};

module.exports = { TEMP_DIR_VIDEOS, TEMP_DIR_AUDIOS };
