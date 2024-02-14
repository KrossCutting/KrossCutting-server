const validateArrays = require("../util/validateArrays");
const filterFramesByTwoSubs = require("../util/filterFramesByTwoSubs");
const getMatchedPercent = require("../util/getMatchedPercent");
const convertFrameToBinaryArray = require("../services/convertFrameToBinaryArray");

// To Do 매개변수 재설정 및 에러 핸들링- 현재 임의로 설정됨
async function chooseFrame(mainFrames, subOneFrames, subTwoFrames) {
  validateArrays(mainFrames, subOneFrames, subTwoFrames);

  const { doubleOverlappedFrames, subOneSingleShots, subTwoSingleShots } =
    filterFramesByTwoSubs(mainFrames, subOneFrames, subTwoFrames);

  await Promise.all(
    doubleOverlappedFrames.map(async (frameNumber) => {
      const [mainPixelBinary, subOnePixelBinary, subTwoPixelBinary] =
        await convertFrameToBinaryArray(frameNumber);
      const subOneMatchRate = getMatchedPercent(
        mainPixelBinary,
        subOnePixelBinary,
      );
      const subTwoMatchRate = getMatchedPercent(
        mainPixelBinary,
        subTwoPixelBinary,
      );

      if (subOneMatchRate >= subTwoMatchRate) {
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
