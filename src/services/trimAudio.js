const { spawn } = require("child_process");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

const ffmpegPath = ffmpeg.path;

function trimAudio(inputPath, outputPath, startTime) {
  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      "-i",
      inputPath,
      "-ss",
      startTime,
      "-c",
      "copy",
      outputPath,
    ];

    const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs);

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

module.exports = trimAudio;
