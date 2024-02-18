const sortFrames = require("../services/sortFrames");
const editFrames = require("../services/editFrames");
const stringifyImgPath = require("../util/stringifyImgPath");
const exportFinalVideo = require("../services/exportFinalVideo");
const getFinalVideoUrl = require("../services/getFinalVideoUrl");
const progressStatus = require("../routes/progressStatus");
const { TEMP_DIR_FRAMES } = require("../constants/paths");

async function crossCutting(req, res, next) {
  const { singleShots } = res.locals;
  const { editPoints } = res.locals;
  const { subOneMergedFrames, subTwoMergedFrames } = await sortFrames(
    singleShots,
    editPoints,
  );

  if (subOneMergedFrames && subTwoMergedFrames) {
    const subOneFrameList = Object.entries(subOneMergedFrames);
    const subTwoFrameList = Object.entries(subTwoMergedFrames);

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

  await exportFinalVideo(TEMP_DIR_FRAMES.MAIN);

  const s3ClientFinalVideoUrl = await getFinalVideoUrl();

  progressStatus.stage = "completed";
  res.status(200).send({
    lastResult: "success",
    s3ClientFinalVideoUrl,
  });
}

module.exports = crossCutting;