const path = require("path");

const TEMP_DIR = path.join(__dirname, "../../temp");

const TEMP_DIR_VIDEOS = {
  FOLDER: path.join(__dirname, "../../temp/videos"),
  MAIN: path.join(__dirname, "../../temp/videos/main"),
  SUB_ONE: path.join(__dirname, "../../temp/videos/sub-one"),
  SUB_TWO: path.join(__dirname, "../../temp/videos/sub-two"),
};

const TEMP_DIR_MP3 = {
  FOLDER: path.join(__dirname, "../../temp/mp3"),
  MAIN: path.join(__dirname, "../../temp/mp3/main"),
  SUB_ONE: path.join(__dirname, "../../temp/mp3/sub-one"),
  SUB_TWO: path.join(__dirname, "../../temp/mp3/sub-two"),
};

const TEMP_DIR_WAV = {
  FOLDER: path.join(__dirname, "../../temp/wav"),
  MAIN: path.join(__dirname, "../../temp/wav/main"),
  SUB_ONE: path.join(__dirname, "../../temp/wav/sub-one"),
  SUB_TWO: path.join(__dirname, "../../temp/wav/sub-two"),
};

const TEMP_DIR_WAV_CUT = {
  FOLDER: path.join(__dirname, "../../temp/wavCut"),
  MAIN: path.join(__dirname, "../../temp/wavCut/main"),
  SUB_ONE: path.join(__dirname, "../../temp/wavCut/sub-one"),
  SUB_TWO: path.join(__dirname, "../../temp/wavCut/sub-two"),
};

const TEMP_DIR_WAV_ADJUSTED = {
  FOLDER: path.join(__dirname, "../../temp/wavAdjusted"),
  MAIN: path.join(__dirname, "../../temp/wavAdjusted/main"),
  SUB_ONE: path.join(__dirname, "../../temp/wavAdjusted/sub-one"),
  SUB_TWO: path.join(__dirname, "../../temp/wavAdjusted/sub-two"),
};

const TEMP_DIR_FRAMES = {
  FOLDER: path.join(__dirname, "../../temp/frames"),
  DIFF: path.join(__dirname, "../../temp/frames/difference"),
  MAIN: path.join(__dirname, "../../temp/frames/main-contents"),
  SUB_ONE: path.join(__dirname, "../../temp/frames/sub-one-contents"),
  SUB_TWO: path.join(__dirname, "../../temp/frames/sub-two-contents"),
};

module.exports = {
  TEMP_DIR_VIDEOS,
  TEMP_DIR_MP3,
  TEMP_DIR_WAV,
  TEMP_DIR_WAV_CUT,
  TEMP_DIR_WAV_ADJUSTED,
  TEMP_DIR_FRAMES,
  TEMP_DIR,
};
