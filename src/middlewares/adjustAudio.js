/* eslint-disable */
const path = require("path");
const ensureDir = require("../util/ensureDir");
const removeDir = require("../util/removeDir");
const trimAudio = require("../services/trimAudio");
const START_POINT = require("../constants/startPoints");
const progressStatus = require("../routes/progressStatus");
const extractStartTime = require("../services/extractStartTime");
const {
  TEMP_DIR_WAV,
  TEMP_DIR_WAV_CUT,
  TEMP_DIR_WAV_ADJUSTED,
} = require("../constants/paths");

async function adjustAudio(req, res, next) {
  try {
    console.log("adjustAudio 시작");

    progressStatus.stage = "audios";
    const videoLabels = Object.keys(req.body.startPoints);
    const videoTimes = Object.values(req.body.startPoints);
    const audioPaths = {};

    for (let index = 0; index < videoLabels.length; index += 1) {
      const videoLabel = videoLabels[index];
      const startPoint = req.body.startPoints[videoLabel];

      let inputPath = "";
      let outputPath = "";
      let adjustedOutputPath = "";

      if (startPoint === "") {
        continue;
      }

      switch (videoLabel) {
        case START_POINT.MAIN:
          adjustedOutputPath = path.join(
            TEMP_DIR_WAV_ADJUSTED.MAIN,
            "main-audio.wav"
          );
          inputPath = path.join(TEMP_DIR_WAV.MAIN, "main-audio.wav");
          outputPath = path.join(TEMP_DIR_WAV_CUT.MAIN, "main-audio.wav");
          audioPaths.mainAudio = { outputPath, adjustedOutputPath };
          await ensureDir(TEMP_DIR_WAV_CUT.MAIN);
          await ensureDir(TEMP_DIR_WAV_ADJUSTED.MAIN);
          break;

        case START_POINT.SUB_ONE:
          adjustedOutputPath = path.join(
            TEMP_DIR_WAV_ADJUSTED.SUB_ONE,
            "sub-one-audio.wav"
          );
          inputPath = path.join(TEMP_DIR_WAV.SUB_ONE, "sub-one-audio.wav");
          outputPath = path.join(TEMP_DIR_WAV_CUT.SUB_ONE, "sub-one-audio.wav");
          audioPaths.subOneAudio = { outputPath, adjustedOutputPath };
          await ensureDir(TEMP_DIR_WAV_CUT.SUB_ONE);
          await ensureDir(TEMP_DIR_WAV_ADJUSTED.SUB_ONE);
          break;

        case START_POINT.SUB_TWO:
          adjustedOutputPath = path.join(
            TEMP_DIR_WAV_ADJUSTED.SUB_TWO,
            "sub-two-audio.wav"
          );
          inputPath = path.join(TEMP_DIR_WAV.SUB_TWO, "sub-two-audio.wav");
          outputPath = path.join(TEMP_DIR_WAV_CUT.SUB_TWO, "sub-two-audio.wav");
          audioPaths.subTwoAudio = { outputPath, adjustedOutputPath };
          await ensureDir(TEMP_DIR_WAV_CUT.SUB_TWO);
          await ensureDir(TEMP_DIR_WAV_ADJUSTED.SUB_TWO);
          break;

        default:
          throw new Error(`Unknown VideoLabel: ${videoLabel}`);
      }

      console.log(
        "inputPath",
        inputPath,
        "outputPath",
        outputPath,
        "startPoint",
        startPoint
      );
      await trimAudio(inputPath, outputPath, startPoint);
    }

    const audioLabels = Object.keys(audioPaths);
    const audioList = Object.values(audioPaths).map(
      (paths) => paths.outputPath
    );
    const adjustedStartTimes = await extractStartTime(audioList);
    console.log("adjustedStartTimes", adjustedStartTimes);

    for (let index = 0; index < adjustedStartTimes.length; index += 1) {
      const adjustedStartTime = adjustedStartTimes[index];
      const currentAudioLabel = audioLabels[index];
      const { outputPath, adjustedOutputPath } = audioPaths[currentAudioLabel];

      console.log(
        "trimAudio start!",
        outputPath,
        adjustedOutputPath,
        adjustedStartTime
      );
      await trimAudio(outputPath, adjustedOutputPath, adjustedStartTime);
      console.log("trimAudio end!");
    }

    // To Do. 실제 작업시 주석해제 필요
    removeDir(TEMP_DIR_WAV.FOLDER);
    removeDir(TEMP_DIR_WAV_CUT.FOLDER);

    const labelInfo = {};

    adjustedStartTimes.forEach((startTime, index) => {
      let videoLabel = "";

      switch (index) {
        case 0:
          videoLabel = START_POINT.MAIN;
          break;

        case 1:
          videoLabel = START_POINT.SUB_ONE;
          break;

        case 2:
          videoLabel = START_POINT.SUB_TWO;
          break;

        default:
          throw new Error("given Video should be less than 3");
      }

      labelInfo[videoLabel] = startTime + videoTimes[index];
      console.log("labelInfo", labelInfo);
    });

    if (req.body.selectedEditPoints !== undefined) {
      console.log("selectedEditPoints exist!");
      res.locals.labelInfo = labelInfo;
      res.locals.isApp = true;
      next();

      return;
    }

    console.log("adjustAudio success!!");

    res.status(201).send({
      result: "success",
      labelInfo,
    });
  } catch (err) {
    console.error("adjustAudio 오류:", err);

    res.status(500).send("fail");
  }
}

module.exports = adjustAudio;
