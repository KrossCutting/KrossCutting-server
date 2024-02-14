const { spawn } = require("child_process");

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

    const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

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
