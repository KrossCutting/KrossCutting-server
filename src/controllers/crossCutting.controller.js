const removeDir = require("../util/removeDir");
const sortFrames = require("../services/sortFrames");
const editFrames = require("../services/editFrames");
const stringifyImgPath = require("../util/stringifyImgPath");
const exportFinalVideo = require("../services/exportFinalVideo");
const getFinalVideoUrl = require("../services/getFinalVideoUrl");
const progressStatus = require("../routes/progressStatus");
const { TEMP_DIR_FRAMES, TEMP_DIR } = require("../constants/paths");
const assignEditPoints = require("../services/assignEditPoints");

async function crossCutting(req, res, next) {
  progressStatus.stage = "editing";
  const { selectedEditPoints } = req.body;
  const { singleShots } = res.locals;
  const { editPoints } = res.locals;

  const { subOneMergedFrames, subTwoMergedFrames } =
    selectedEditPoints === undefined
      ? await sortFrames(singleShots, editPoints)
      : assignEditPoints(editPoints, selectedEditPoints);

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

  progressStatus.stage = "exporting";

  const s3ClientFinalVideoUrl = await getFinalVideoUrl();

  progressStatus.stage = "complete";

  res.status(201).send({
    lastResult: "success",
    s3ClientFinalVideoUrl,
  });

  // 실제 작업시 주석해제 필요
  // removeDir(TEMP_DIR);
}

module.exports = crossCutting;
