const { spawn } = require("child_process");

function convertVideoFormat(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    const ffmpegVideo = spawn("ffmpeg", [
      "-i",
      inputFilePath,
      "-c:v",
      "libx264",
      "-f",
      "mp4",
      outputFilePath,
    ]);

    ffmpegVideo.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegVideo.stderr.on("data", (data) => {
      reject();
      console.error(`stdout: ${data}`);
    });

    ffmpegVideo.on("close", (code) => {
      resolve();
      console.log(`child process exited with code ${code}`);
    });

    ffmpegVideo.on("error", (err) => {
      reject();
      console.error(`Error: ${err.message}`);
    });
  });
}

function convertAudioFormat(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    const ffmpegAudio = spawn("ffmpeg", [
      "-i",
      inputFilePath,
      "-vn",
      "-ab",
      "128k",
      "-f",
      "mp3",
      outputFilePath,
    ]);

    ffmpegAudio.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegAudio.stderr.on("data", (data) => {
      console.error(`stdout: ${data}`);
    });

    ffmpegAudio.on("close", (code) => {
      resolve();
      console.log(`child process exited with code ${code}`);
    });

    ffmpegAudio.on("error", (err) => {
      console.error(`Error: ${err.message}`);
    });
  });
}

module.exports = { convertVideoFormat, convertAudioFormat };
