const validateArrays = require("./validateArrays");

function sortCommonFrames(mainFrames, subOneFrames, subTwoFrames) {
  validateArrays(mainFrames, subOneFrames, subTwoFrames);

  const doubleOverlappedFrames = mainFrames.filter((imageNumber) => {
    const hasSubOneSameFrame = subOneFrames.includes(imageNumber);
    const hasSubTwoSameFrame = subTwoFrames.includes(imageNumber);

    if (hasSubOneSameFrame && hasSubTwoSameFrame) {
      return true;
    }

    return false;
  });

  const commonSubOne = subOneFrames.filter((imageNumber) => {
    const hasMainSameFrame = mainFrames.includes(imageNumber);
    const hasSubTwoSameFrame = subTwoFrames.includes(imageNumber);

    return hasMainSameFrame && !hasSubTwoSameFrame;
  });

  const commonSubTwo = subTwoFrames.filter((imageNumber) => {
    const hasMainSameFrame = mainFrames.includes(imageNumber);
    const hasSubOneSameFrame = subOneFrames.includes(imageNumber);

    return hasMainSameFrame && !hasSubOneSameFrame;
  });

  return {
    doubleOverlappedFrames,
    subOneSingleShots: commonSubOne,
    subTwoSingleShots: commonSubTwo,
  };
}

module.exports = sortCommonFrames;
