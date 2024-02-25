/* eslint-disable */
const parseImgPath = require("../util/parseImgPath");

function distributeFramesEvenly(editPoints) {
  const subOneFrames = {};
  const subTwoFrames = {};
  const framePaths = Object.keys(editPoints);
  const frameDurations = Object.values(editPoints);

  framePaths.forEach((path, index) => {
    const frameNumber = parseImgPath(path).frameNumber;
    const frameDuration = frameDurations[index];

    if (index % 2 === 0) {
      subOneFrames[frameNumber] = frameDuration;
      return;
    }

    return subTwoFrames[frameNumber] = frameDuration;
  });

  return { subOneFrames, subTwoFrames };
}

module.exports = distributeFramesEvenly;
