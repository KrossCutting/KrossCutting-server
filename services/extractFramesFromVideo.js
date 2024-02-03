const { spawn } = require("child_process");
const path = require("path");

function extractFramesFromVideo(inputPath, framePath, startSecond, fps) {
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
    console.error(`stdout: ${data}`);
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ffmpegProcess.on("error", (err) => {
    console.error(`Error: ${err.message}`);
  });
}

module.exports = extractFramesFromVideo;
