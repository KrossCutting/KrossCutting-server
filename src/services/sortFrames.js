const parseImgPath = require("../util/parseImgPath");
const getBlackPercent = require("../util/getBlackPercent");
const filterFramesByTwoSubs = require("../util/filterFramesByTwoSubs");
const convertFrameToBinaryArray = require("./convertFrameToBinaryArray");
const mergeFrames = require("../util/mergeFrames");

async function sortFrames(singleShots, editPoints) {
  const durationFrames = {};
  const subOneFrames = {};
  const subTwoFrames = {};
  const [_, subOneFrameInfo, subTwoFrameInfo] = Object.keys(singleShots);
  const durationPaths = Object.keys(editPoints);
  const mainFrameNumbers = durationPaths.map(
    (framePath) => parseImgPath(framePath).frameNumber,
  );
  const subOneFrameNumbers = singleShots[subOneFrameInfo].map(
    (framePath) => parseImgPath(framePath).frameNumber,
  );
  const subTwoFrameNumbers = singleShots[subTwoFrameInfo].map(
    (framePath) => parseImgPath(framePath).frameNumber,
  );

  durationPaths.forEach((framePath) => {
    const { frameNumber } = parseImgPath(framePath);
    const duration = editPoints[framePath];

    durationFrames[frameNumber] = duration;
  });

  const {
    doubleOverlappedFrames,
    subOneOverlappedFrames,
    subTwoOverlappedFrames,
  } = filterFramesByTwoSubs(
    mainFrameNumbers,
    subOneFrameNumbers,
    subTwoFrameNumbers,
  );

  await Promise.all(
    doubleOverlappedFrames.map(async (frameNumber) => {
      const [subOnePixelBinary, subTwoPixelBinary] =
        await convertFrameToBinaryArray(frameNumber);

      const subOneMatchRate = getBlackPercent(subOnePixelBinary);
      const subTwoMatchRate = getBlackPercent(subTwoPixelBinary);

      if (subOneMatchRate >= subTwoMatchRate) {
        subOneOverlappedFrames.push(frameNumber);
      } else {
        subTwoOverlappedFrames.push(frameNumber);
      }
    }),
  );

  subOneOverlappedFrames.sort((a, b) => a - b);
  subTwoOverlappedFrames.sort((a, b) => a - b);

  subOneOverlappedFrames.forEach((frameNumber) => {
    const duration = durationFrames[frameNumber];

    subOneFrames[frameNumber] = duration;
  });
  subTwoOverlappedFrames.forEach((frameNumber) => {
    const duration = durationFrames[frameNumber];

    subTwoFrames[frameNumber] = duration;
  });

  const subOneMergedFrames = mergeFrames(subOneFrames);
  const subTwoMergedFrames = mergeFrames(subTwoFrames);

  return { subOneMergedFrames, subTwoMergedFrames };
}

module.exports = sortFrames;
