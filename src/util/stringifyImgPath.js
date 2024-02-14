const { TEMP_DIR_FRAMES } = require("../constants/paths");

function stringifyImgPath(videoLabel, frameNumber) {
  let imgPathResult;

  switch (videoLabel) {
    case "main-contents":
      imgPathResult = `${TEMP_DIR_FRAMES.MAIN}/frame_30fps_${frameNumber}.jpg`;
      break;

    case "sub-one-contents":
      imgPathResult = `${TEMP_DIR_FRAMES.SUB_ONE}/frame_30fps_${frameNumber}.jpg`;
      break;

    case "sub-two-contents":
      imgPathResult = `${TEMP_DIR_FRAMES.SUB_TWO}/frame_30fps_${frameNumber}.jpg`;
      break;

    default:
      break;
  }

  return imgPathResult;
}

module.exports = stringifyImgPath;
