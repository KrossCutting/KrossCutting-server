const stringifyImgPath = require("../util/stringifyImgPath");
const editFrames = require("../services/editFrames");
const exportFinalVideo = require("../services/exportFinalVideo");

async function crossCutting(req, res, next) {
  // const singleShots = res.locals.singleShots;
  // const editPoints = res.locals.editPoints;
  // const { subOneFrames, subTwoFrames } = await sortFrames(singleShots, editPoints);

  // TODO: 잠시 Mock Data를 사용합니다. main 브랜치에 병합 전에 변경예정입니다.
  const subOneFrames = {
    1740: 3,
    2190: 4,
    2610: 4,
    3690: 3,
    4530: 2,
  };
  const subTwoFrames = {
    90: 2,
    330: 2,
    450: 2,
    570: 3,
    840: 4,
    1290: 3,
    2910: 3,
    3090: 4,
    3300: 5,
    4170: 4,
    4350: 5,
    6450: 2,
  };

  if (subOneFrames && subTwoFrames) {
    const subOneFrameList = Object.entries(subOneFrames);
    const subTwoFrameList = Object.entries(subTwoFrames);

    if (subOneFrameList.length) {
      const subOnePromiseList = subOneFrameList.map(
        async ([frameNumber, durationTime]) => {
          const mainFramePath = stringifyImgPath("main-contents", frameNumber);
          const subFramePath = stringifyImgPath(
            "sub-one-contents",
            frameNumber,
          );

          await editFrames(mainFramePath, subFramePath, durationTime);
        },
      );

      await Promise.all(subOnePromiseList);
    }

    if (subTwoFrameList.length) {
      const subTwoPromiseList = subTwoFrameList.map(
        async ([frameNumber, durationTime]) => {
          const mainFramePath = stringifyImgPath("main-contents", frameNumber);
          const subFramePath = stringifyImgPath(
            "sub-two-contents",
            frameNumber,
          );

          await editFrames(mainFramePath, subFramePath, durationTime);
        },
      );

      await Promise.all(subTwoPromiseList);
    }
  }

  await exportFinalVideo();

  res.status(200).send("success");
}

module.exports = crossCutting;
