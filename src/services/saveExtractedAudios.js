const path = require("path");
const { spawn } = require("child_process");
const ensureDir = require("../util/ensureDir");
const { TEMP_DIR_MP3, TEMP_DIR_WAV } = require("../constants/paths");

function extractAudios(inputPath, outputPath, format) {
  return new Promise((resolve, reject) => {
    const args = [
      "-i",
      inputPath,
      "-vn",
      "-ar",
      "44100",
      "-ac",
      "2",
      format === "mp3" ? "-b:a" : "-acodec",
      format === "mp3" ? "192k" : "pcm_s16le",
      outputPath,
    ];
    const ffmpeg = spawn("ffmpeg", args);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        console.error(`[${format}] ffmpeg process exited with code ${code}`);
        reject(
          new Error(`[${format}] ffmpeg process exited with code ${code}`),
        );
      }
    });
  });
}

async function saveExtractedAudios(videoPath) {
  const fileRole = path.dirname(videoPath).split("/").pop();
  const outputPaths = {
    mp3: path.join(TEMP_DIR_MP3.FOLDER, fileRole, `${fileRole}-audio.mp3`),
    wav: path.join(TEMP_DIR_WAV.FOLDER, fileRole, `${fileRole}-audio.wav`),
  };
  const outputDir = {
    mp3: path.join(TEMP_DIR_MP3.FOLDER, fileRole),
    wav: path.join(TEMP_DIR_WAV.FOLDER, fileRole),
  };

  await ensureDir(outputDir.mp3);
  await ensureDir(outputDir.wav);

  const tasks = Object.entries(outputPaths).map(([format, outputPath]) =>
    extractAudios(videoPath, outputPath, format),
  );

  await Promise.all(tasks);

  return outputPaths.mp3;
}

module.exports = saveExtractedAudios;
