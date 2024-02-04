const { spawn } = require("child_process");
const path = require("path");

async function extractFramesFromVideo(inputPath, framePath, startSecond, fps) {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-vf",
      `fps=${fps}`,
      "-ss",
      startSecond,
      "-start_number",
      "1",
      path.join(framePath, `frame_%d.jpg`),
    ]);

    ffmpegProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Frame extraction completed successfully");
        resolve();
      } else {
        console.error(`Error: ffmpeg process exited with code ${code}`);
        reject();
      }
    });

    ffmpegProcess.on("error", (err) => {
      console.error(`Error: ${err.message}`);
      reject();
    });
  });
}

module.exports = extractFramesFromVideo;
