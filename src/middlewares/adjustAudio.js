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

      await trimAudio(inputPath, outputPath, startPoint);
    }

    const audioLabels = Object.keys(audioPaths);
    const audioList = Object.values(audioPaths).map(
      (paths) => paths.outputPath
    );
    const adjustedStartTimes = await extractStartTime(audioList);

    for (let index = 0; index < adjustedStartTimes.length; index += 1) {
      const adjustedStartTime = adjustedStartTimes[index];
      const currentAudioLabel = audioLabels[index];
      const { outputPath, adjustedOutputPath } = audioPaths[currentAudioLabel];

      await trimAudio(outputPath, adjustedOutputPath, adjustedStartTime);
    }

    // To Do. 실제 작업시 주석해제 필요
    // removeDir(TEMP_DIR_WAV.FOLDER);
    // removeDir(TEMP_DIR_WAV_CUT.FOLDER);

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
    });

    res.status(200).send({
      result: "success",
      labelInfo,
    });
  } catch (err) {
    console.error(err);

    res.status(500).send("fail");
  }
}

module.exports = adjustAudio;
