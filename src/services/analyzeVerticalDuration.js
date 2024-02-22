const path = require("path");
const fs = require("fs").promises;

const select1fpsFrames = require("../util/select1fpsFrames");
const { TEMP_DIR_FRAMES } = require("../constants/paths");

const MOVEMENT_THRESHOLD = 0.09;

async function analyzeVerticalDuration(
  singleShotFrameList,
  movementResults,
  nonSelectedFramesMovementAvg,
) {
  const mainFrameFileList = await fs.readdir(TEMP_DIR_FRAMES.MAIN);
  const mainFramePathList = mainFrameFileList.map((frame) =>
    path.join(TEMP_DIR_FRAMES.MAIN, frame),
  );

  mainFramePathList.sort((a, b) => {
    const currentFramePath = parseInt(path.basename(a).split("_").pop(), 10);
    const nextFramePath = parseInt(path.basename(b).split("_").pop(), 10);

    return currentFramePath - nextFramePath;
  });

  const filtered1fpsFramePathList = select1fpsFrames(mainFramePathList);

  const replacementDuration = {};

  for (
    let singleShotIndex = 0;
    singleShotIndex < singleShotFrameList.length - 1;
    singleShotIndex += 1
  ) {
    let duration = 1;
    const currentSingleShotPath = singleShotFrameList[singleShotIndex];
    const nextSingleShotpath = singleShotFrameList[singleShotIndex + 1];

    const currentSingleShotIndex = filtered1fpsFramePathList.findIndex(
      (framePath) => framePath === currentSingleShotPath,
    );
    const nextSingleShotIndex = filtered1fpsFramePathList.findIndex(
      (framePath) => framePath === nextSingleShotpath,
    );

    for (
      let nextFrame = currentSingleShotIndex + 1;
      nextFrame < nextSingleShotIndex;
      nextFrame += 1
    ) {
      const { movementRatio } = movementResults[nextFrame];

      if (movementRatio < nonSelectedFramesMovementAvg) {
        break;
      }

      duration += 1;
    }

    replacementDuration[currentSingleShotPath] = duration;
  }

  return replacementDuration;
}

module.exports = analyzeVerticalDuration;
