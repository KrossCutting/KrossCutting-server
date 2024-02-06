const path = require("path");

const TEMP_DIR = path.join(__dirname, "../temp");

const TEMP_DIR_VIDEOS = {
  VIDEOS: path.join(__dirname, "../temp/videos"),
  MAIN: path.join(__dirname, "../temp/videos/main"),
  SUB_ONE: path.join(__dirname, "../temp/videos/sub-one"),
  SUB_TWO: path.join(__dirname, "../temp/videos/sub-two"),
};

const TEMP_DIR_AUDIOS = {
  AUDIOS: path.join(__dirname, "../temp/audios"),
  MAIN: path.join(__dirname, "../temp/audios/main"),
  SUB_ONE: path.join(__dirname, "../temp/audios/sub-one"),
  SUB_TWO: path.join(__dirname, "../temp/audios/sub-two"),
};

const TEMP_DIR_FRAMES = {
  FRAMES: path.join(__dirname, "../temp/frames"),
  DIFF: path.join(__dirname, "../temp/frames/difference"),
  MAIN: path.join(__dirname, "../temp/frames/main-contents"),
  SUB_ONE: path.join(__dirname, "../temp/frames/sub-one-contents"),
  SUB_TWO: path.join(__dirname, "../temp/frames/sub-two-contents"),
};

module.exports = {
  TEMP_DIR_VIDEOS,
  TEMP_DIR_AUDIOS,
  TEMP_DIR_FRAMES,
  TEMP_DIR,
};
