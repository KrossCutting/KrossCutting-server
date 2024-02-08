const detectMovement = require("./detectMovement");

const MOVEMENT_THRESHOLD = 0.09;

async function detectSingleMovement(sortedFrameList, folderName) {
  const detectedMovementList = await detectMovement(
    sortedFrameList,
    folderName,
  );

  const detectedSingleShotList = detectedMovementList.filter(
    (movementOfFrame) => movementOfFrame.movementRatio > MOVEMENT_THRESHOLD,
  );

  const detectedSingleMovementFrames = detectedSingleShotList.map(
    (movementOfFrame) => {
      const framePath = movementOfFrame.path;

      return parseInt(framePath.split("_").pop(), 10);
    },
  );

  return detectedSingleMovementFrames;
}

module.exports = detectSingleMovement;
