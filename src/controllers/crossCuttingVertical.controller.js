const removeDir = require("../util/removeDir");
const editFrames = require("../services/editFrames");
const progressStatus = require("../routes/progressStatus");
const stringifyImgPath = require("../util/stringifyImgPath");
const exportFinalVideo = require("../services/exportFinalVideo");
const getFinalVideoUrl = require("../services/getFinalVideoUrl");
const assignEditPoints = require("../services/assignEditPoints");
const { TEMP_DIR_FRAMES, TEMP_DIR } = require("../constants/paths");

async function crossCuttingVertical(req, res, next) {
  progressStatus.stage = "editing";
  const { selectedEditPoints } = req.body;
  const { editPoints } = res.locals;

  const { subOneFrames, subTwoFrames } = assignEditPoints(
    editPoints,
    selectedEditPoints,
  );

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

  await exportFinalVideo(TEMP_DIR_FRAMES.MAIN);

  progressStatus.stage = "exporting";

  const s3ClientFinalVideoUrl = await getFinalVideoUrl();

  res.status(201).send({
    lastResult: "success",
    s3ClientFinalVideoUrl,
  });

  // 실제 작업시 주석해제 필요
  // removeDir(TEMP_DIR);
}

module.exports = crossCuttingVertical;
