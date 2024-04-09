/* eslint-disable */
const path = require("path");
const removeDir = require("../util/removeDir");
const ensureDir = require("../util/ensureDir");
const START_POINT = require("../constants/startPoints");
const progressStatus = require("../routes/progressStatus");
const extractFramesFromVideo = require("../services/extractFramesFromVideo");
const { TEMP_DIR_FRAMES, TEMP_DIR_VIDEOS } = require("../constants/paths");

async function extractFrames(req, res, next) {
  try {
    progressStatus.stage = "frames";
    const isApp = res.locals?.isApp;
    const videoLabels = isApp ? Object.keys(res.locals.labelInfo) :  Object.keys(req.body);

    for (let index = 0; index < videoLabels.length; index += 1) {
      const videoLabel = videoLabels[index];
      // 시연 후 수정 필요
      const startTime = isApp ? res.locals.labelInfo[videoLabel] : req.body[videoLabel];
      const fileExtension = isApp ? ".MOV" : ".mp4";

      let inputPath = "";
      let outputPath = "";

      switch (videoLabel) {
        case START_POINT.MAIN:
          inputPath = path.join(TEMP_DIR_VIDEOS.MAIN, `main-video${fileExtension}`);
          outputPath = TEMP_DIR_FRAMES.MAIN;
          break;

        case START_POINT.SUB_ONE:
          inputPath = path.join(TEMP_DIR_VIDEOS.SUB_ONE, `sub-one-video${fileExtension}`);
          outputPath = TEMP_DIR_FRAMES.SUB_ONE;
          break;

        case START_POINT.SUB_TWO:
          inputPath = path.join(TEMP_DIR_VIDEOS.SUB_TWO, `sub-two-video${fileExtension}`);
          outputPath = TEMP_DIR_FRAMES.SUB_TWO;
          break;

        default:
          throw new Error(`Unknown videoLabel: ${videoLabel}`);
      }

      await ensureDir(outputPath);
      await extractFramesFromVideo(inputPath, outputPath, startTime);
    }

    //To Do 실제 작업을 위한 removeDir 적용 필요
    removeDir(TEMP_DIR_VIDEOS.MAIN);
    removeDir(TEMP_DIR_VIDEOS.SUB_ONE);
    removeDir(TEMP_DIR_VIDEOS.SUB_TWO);

    res.locals.videoCount = videoLabels.length;

    next();
  } catch (err) {
    console.error(err);

    res.status(500).send("fail");
  }
}

module.exports = extractFrames;
