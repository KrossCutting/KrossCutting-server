function detectVerticalSingleShots(movementRatioList) {
  const movementRatioFrames = movementRatioList.map((frameMovementInfo) => {
    return frameMovementInfo.movementRatio;
  });

  const normalizedMovementRatioList = movementRatioFrames.slice(0, -10);
  const movementRatioAvg =
    normalizedMovementRatioList.reduce((acc, cur) => acc + cur, 0) /
    normalizedMovementRatioList.length;

  const underAverageMovementList = normalizedMovementRatioList.filter(
    (movementRatio) => movementRatio < movementRatioAvg,
  );
  const nonSelectedFramesMovementAvg =
    underAverageMovementList.reduce((acc, cur) => acc + cur, 0) /
    underAverageMovementList.length;

  const singleShotList = [];

  for (let i = 0; i < movementRatioList.length; i += 1) {
    const movementResult = movementRatioList[i];

    if (movementResult.movementRatio >= movementRatioAvg) {
      singleShotList.push(movementResult.path);
    }
  }

  return [singleShotList, nonSelectedFramesMovementAvg];
}

module.exports = detectVerticalSingleShots;
