const { spawn } = require("child_process");
const path = require("path");

// TO DO: ffmpeg에 전달하는 배열인수를 반환하는 함수(duration 옵션 추가 등)
async function extractFramesFromVideo(inputPath, framePath, startSecond) {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-vf",
      "fps=30",
      "-ss",
      startSecond,
      "-q:v",
      "1",
      "-start_number",
      "0",
      path.join(framePath, "frame_30fps_%d.jpg"),
    ]);

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Frame extraction completed successfully");
        resolve();
      } else {
        console.error(`Error: ffmpeg process exited with code ${code}`);
        reject();
      }
    });
  });
}

module.exports = extractFramesFromVideo;
