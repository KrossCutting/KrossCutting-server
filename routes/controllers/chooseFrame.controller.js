const validateArrays = require("../../util/validateArrays");
const sortCommonFrames = require("../../util/sortCommonFrames");
const getMatchedPercent = require("../../util/getMatchedPercent");
const convertFrameToBinaryArray = require("../../services/convertFrameToBinaryArray");

// To Do 매개변수 재설정 - 현재 임의로 설정됨
async function chooseFrame(mainFrames, subOneFrames, subTwoFrames) {
  validateArrays(mainFrames, subOneFrames, subTwoFrames);

  const { doubleOverlappedFrames, subOneSingleShots, subTwoSingleShots } =
    sortCommonFrames(mainFrames, subOneFrames, subTwoFrames);

  await Promise.all(
    doubleOverlappedFrames.map(async (frameNumber) => {
      const [mainBinary, subOneBinary, subTwoBinary] =
        await convertFrameToBinaryArray(frameNumber);
      const subOnePercent = getMatchedPercent(mainBinary, subOneBinary);
      const subTwoPercent = getMatchedPercent(mainBinary, subTwoBinary);

      if (subOnePercent >= subTwoPercent) {
        subOneSingleShots.push(frameNumber);
      } else {
        subTwoSingleShots.push(frameNumber);
      }
    }),
  );

  subOneSingleShots.sort((a, b) => a - b);
  subTwoSingleShots.sort((a, b) => a - b);

  return { subOneSingleShots, subTwoSingleShots };
}

module.exports = chooseFrame;
