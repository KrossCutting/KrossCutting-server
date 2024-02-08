const detectMovement = require("./detectMovement");

const MOVEMENT_THRESHOLD = 0.09;

async function getSingleMovementFrames(sortedFrameList, folderName) {
  const detectedMovementList = await detectMovement(
    sortedFrameList,
    folderName,
  );

  const detectedSingleShotList = detectedMovementList.filter(
    (movementOfFrame) => movementOfFrame.movementRatio > MOVEMENT_THRESHOLD,
  );

  const detectedSingleMovementFrameNumbers = detectedSingleShotList.map(
    (movementOfFrame) => {
      const framePath = movementOfFrame.path;

      return parseInt(framePath.split("_").pop(), 10);
    },
  );

  return {
    detectedMovementList,
    detectedSingleMovementFrameNumbers,
  };
}

module.exports = getSingleMovementFrames;
