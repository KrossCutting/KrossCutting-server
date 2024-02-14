/* eslint-disable */
const path = require("path")
const ensureDir = require("../util/ensureDir");
const extractFramesFromVideo = require("../services/extractFramesFromVideo");
const { TEMP_DIR_FRAMES, TEMP_DIR_VIDEOS } = require("../constants/paths");

async function extractFrames(req, res, next) {
  try {
    const videoLabels = Object.keys(res.locals.adjustedStartTimes);

    for (let i = 0; i < videoLabels.length; i += 1) {
      const videoLabel = videoLabels[i];
      const startTime = req.body[videoLabel];

      let inputPath = "";
      let outputPath = "";

      switch(videoLabel) {
        case "mainStartPoint":
          inputPath = path.join(TEMP_DIR_VIDEOS.MAIN, "main-video.mp4");
          outputPath = TEMP_DIR_FRAMES.MAIN;
          break;

        case "subOneStartPoint":
          inputPath = path.join(TEMP_DIR_VIDEOS.SUB_ONE, "sub-one-video.mp4");
          outputPath = TEMP_DIR_FRAMES.SUB_ONE;
          break;

        case "subTwoStartPoint":
          inputPath = path.join(TEMP_DIR_VIDEOS.SUB_TWO, "sub-two-video.mp4");
          outputPath = TEMP_DIR_FRAMES.SUB_TWO;
          break;

        default:
          throw new Error(`Unknown videoLabel: ${videoLabel}`);
      }

      console.log(outputPath);
      await ensureDir(outputPath);
      await extractFramesFromVideo(inputPath, outputPath, startTime);
    }

    //To Do 실제 작업을 위한 removeDir 적용 필요

    res.locals.videoCount = videoLabels.length;

    next()
    res.status(200).send("success");
  } catch (err) {
    console.error(err);

    res.status(500).send("fail");
  }
}

module.exports = extractFrames;