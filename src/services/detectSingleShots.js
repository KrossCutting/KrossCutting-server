function detectSingleShots(facePredictionList, movementRatioList) {
  const movementRatioFrames = movementRatioList.map((frameMovementInfo) => {
    return frameMovementInfo.movementRatio;
  });
  const normalizedMovementRatioList = movementRatioFrames.slice(0, -10);
  const movementRatioAvg =
    normalizedMovementRatioList.reduce((acc, cur) => acc + cur, 0) /
    normalizedMovementRatioList.length;

  const SINGLESHOT_MOVEMENT_THRESHOLD = movementRatioAvg;

  const singleShotList = [];

  for (let i = 0; i < movementRatioList.length; i += 1) {
    const movementResult = movementRatioList[i];
    const facePrediction = facePredictionList[i];
    // NOTICE: 만약 movementResult, facePrediction의 동일한 인덱스에 동일한 path 정보가 아닐 경우,
    // find메서드를 사용하여 정확한 값을 찾습니다. (아래 코드)
    /*
      const facePrediction = facePredictionList.find(
        (prediction) => prediction.framePath === movementResult.path
      );
    */

    if (movementResult.movementRatio >= 0.1) {
      if (
        movementResult.movementRatio >= SINGLESHOT_MOVEMENT_THRESHOLD &&
        facePrediction &&
        facePrediction.predictions.length > 0
      ) {
        singleShotList.push(movementResult.path);
      } else if (
        facePrediction &&
        facePrediction.predictions.length === 1 &&
        facePrediction.predictions[0].probability > 0.95
      ) {
        singleShotList.push(movementResult.path);
      }
    }
  }

  return singleShotList;
}

module.exports = detectSingleShots;
