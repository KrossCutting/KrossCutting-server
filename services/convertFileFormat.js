const { spawn } = require("child_process");
const { PassThrough } = require("stream");

function convertVideoFormat(videoStream) {
  const videoPassThrough = new PassThrough();
  const ffmpegVideo = spawn("ffmpeg", [
    "-i",
    "pipe:0",
    "-c:v",
    "libx264",
    "-f",
    "mp4",
    "pipe:1",
  ]);

  videoStream.on("error", (err) => {
    console.error("Video stream error:", err);
  });

  ffmpegVideo.stdin.on("error", (err) => {
    console.error("FFmpeg video stdin error:", err);
  });

  ffmpegVideo.stdout.on("error", (err) => {
    console.error("FFmpeg video stdout error:", err);

    if (err.code === "EPIPE") {
      process.exit(0);
    }
  });

  videoStream.pipe(ffmpegVideo.stdin);
  ffmpegVideo.stdout.pipe(videoPassThrough);

  ffmpegVideo.once("close", (code) => {
    console.log(`ffmpeg video process closed with code ${code}`);
  });

  ffmpegVideo.once("error", (err) => {
    console.error(`ffmpeg video process error: ${err}`);
  });

  return videoPassThrough;
}

function convertAudioFormat(audioStream) {
  const audioPassThrough = new PassThrough();
  const ffmpegAudio = spawn("ffmpeg", [
    "-i",
    "pipe:0",
    "-vn",
    "-ab",
    "128k",
    "-f",
    "mp3",
    "pipe:1",
  ]);

  audioStream.on("error", (err) => {
    console.error("Audio stream error:", err);
  });

  ffmpegAudio.stdin.on("error", (err) => {
    console.error("FFmpeg Audio stdin error:", err);
  });

  ffmpegAudio.stdout.on("error", (err) => {
    console.error("FFmpeg Audio stdout error:", err);

    if (err.code === "EPIPE") {
      process.exit(0);
    }
  });

  audioStream.pipe(ffmpegAudio.stdin);
  ffmpegAudio.stdout.pipe(audioPassThrough);

  ffmpegAudio.once("close", (code) => {
    console.log(`ffmpeg audio process closed with code ${code}`);
  });

  ffmpegAudio.once("error", (err) => {
    console.error(`ffmpeg audio process error: ${err}`);
  });

  return audioPassThrough;
}

module.exports = { convertVideoFormat, convertAudioFormat };
