/* eslint-disable */
const { TEMP_DIR_FRAMES } = require("../constants/paths");

function stringifyImgPath(videoLabel, frameNumber) {
  switch (videoLabel) {
    case "main-contents":
      return `${TEMP_DIR_FRAMES.MAIN}/frame_30fps_${frameNumber}.jpg`;

    case "sub-one-contents":
      return `${TEMP_DIR_FRAMES.SUB_ONE}/frame_30fps_${frameNumber}.jpg`;

    case "sub-two-contents":
      return `${TEMP_DIR_FRAMES.SUB_TWO}/frame_30fps_${frameNumber}.jpg`;

    default:
      return;
  }
}

module.exports = stringifyImgPath;
