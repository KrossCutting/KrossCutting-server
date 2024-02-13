const validateArrays = require("./validateArrays");

function filterFramesByTwoSubs(mainFrames, subOneFrames, subTwoFrames) {
  validateArrays(mainFrames, subOneFrames, subTwoFrames);

  const doubleOverlappedFrames = [];
  const subOneOverlappedFrames = [];
  const subTwoOverlappedFrames = [];

  mainFrames.forEach((frameNumber) => {
    const hasSubOneSameFrame = subOneFrames.includes(frameNumber);
    const hasSubTwoSameFrame = subTwoFrames.includes(frameNumber);

    if (hasSubOneSameFrame && hasSubTwoSameFrame) {
      doubleOverlappedFrames.push(frameNumber);
    } else if (hasSubOneSameFrame && !hasSubTwoSameFrame) {
      subOneOverlappedFrames.push(frameNumber);
    } else if (!hasSubOneSameFrame && hasSubTwoSameFrame) {
      subTwoOverlappedFrames.push(frameNumber);
    }
  });

  return {
    doubleOverlappedFrames,
    subOneOverlappedFrames,
    subTwoOverlappedFrames,
  };
}

module.exports = filterFramesByTwoSubs;
