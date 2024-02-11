const path = require("path");
const fs = require("fs").promises;

const select1fpsFrames = require("../util/select1fpsFrames");
const { TEMP_DIR_FRAMES } = require("../constants/paths");

const mainFrameDirectory = path.join(TEMP_DIR_FRAMES.MAIN);

const MOVEMENT_THRESHOLD = 0.09;

async function analyzeDuration(
  singleShotNumberList,
  faceCountResults,
  movementResults,
) {
  const mainFrameFileList = await fs.readdir(mainFrameDirectory);
  const mainFramePathList = mainFrameFileList.map((frame) =>
    path.join(mainFrameDirectory, frame),
  );

  mainFramePathList.sort((a, b) => {
    const currentFramePath = parseInt(path.basename(a).split("_").pop(), 10);
    const nextFramePath = parseInt(path.basename(b).split("_").pop(), 10);

    return currentFramePath - nextFramePath;
  });

  const filteredFramePathList = select1fpsFrames(mainFramePathList);

  const mainSingleShotPathList = filteredFramePathList.filter((framePath) => {
    const frameNumber = parseInt(framePath.split("_").pop(), 10);

    return singleShotNumberList.includes(frameNumber);
  });

  const replacementDuration = {};

  for (
    let singleShotIndex = 0;
    singleShotIndex < mainSingleShotPathList.length - 1;
    singleShotIndex += 1
  ) {
    let duration = 0;
    const currentSingleShotPath = mainSingleShotPathList[singleShotIndex];
    const nextSingleShotpath = mainSingleShotPathList[singleShotIndex + 1];

    const currentSingleShotIndex = filteredFramePathList.findIndex(
      (framePath) => framePath === currentSingleShotPath,
    );
    const nextSingleShotIndex = filteredFramePathList.findIndex(
      (framePath) => framePath === nextSingleShotpath,
    );

    for (
      let nextFrame = currentSingleShotIndex + 1;
      nextFrame < nextSingleShotIndex;
      nextFrame += 1
    ) {
      const { predictions } = faceCountResults[nextFrame];
      const { movementRatio } = movementResults[nextFrame];

      if (predictions.length < 1 || movementRatio <= MOVEMENT_THRESHOLD) {
        break;
      }

      duration += 1;
    }

    replacementDuration[currentSingleShotPath] = duration;
  }

  return replacementDuration;
}

module.exports = analyzeDuration;
