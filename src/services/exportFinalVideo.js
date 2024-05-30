const { spawn } = require("child_process");
const path = require("path");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

const ffmpegPath = ffmpeg.path;

const {
  TEMP_DIR_FRAMES,
  TEMP_DIR_WAV_ADJUSTED,
  TEMP_DIR_VIDEOS,
} = require("../constants/paths");

const VIDEO_SCALE = "1920:1080";

function exportFinalVideo() {
  return new Promise((resolve, reject) => {
    const finalVideoPath = path.join(TEMP_DIR_VIDEOS.FOLDER, "final-video.mp4");
    const finalAudioPath = path.join(
      TEMP_DIR_WAV_ADJUSTED.MAIN,
      "main-audio.wav",
    );
    const inputVideoPattern = path.join(
      TEMP_DIR_FRAMES.MAIN,
      "frame_30fps_%d.jpg",
    );

    const ffmpegProcess = spawn(ffmpegPath, [
      "-y",
      "-framerate",
      "30",
      "-i",
      inputVideoPattern,
      "-i",
      finalAudioPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      `scale=${VIDEO_SCALE}`,
      "-crf",
      "23",
      "-b:a",
      "128k",
      finalVideoPath,
    ]);

    ffmpegProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg process exited with code ${code}`));
      }
    });
  });
}

module.exports = exportFinalVideo;
