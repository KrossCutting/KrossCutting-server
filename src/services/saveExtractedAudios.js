const path = require("path");
const { spawn } = require("child_process");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

const ffmpegPath = ffmpeg.path;

const ensureDir = require("../util/ensureDir");
const { TEMP_DIR_WAV } = require("../constants/paths");

function extractAudios(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-i",
      inputPath,
      "-vn",
      "-ar",
      "44100",
      "-ac",
      "2",
      "-acodec",
      "pcm_s16le",
      outputPath,
    ];
    const ffmpegResult = spawn(ffmpegPath, args);

    ffmpegResult.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        console.error(`ffmpeg process exited with code ${code}`);
        reject(new Error(`ffmpeg process exited with code ${code}`));
      }
    });
  });
}

async function saveExtractedAudios(videoPath) {
  const fileRole = path.dirname(videoPath).split("/").pop();
  const outputPath = path.join(
    TEMP_DIR_WAV.FOLDER,
    fileRole,
    `${fileRole}-audio.wav`,
  );
  const outputDir = path.join(TEMP_DIR_WAV.FOLDER, fileRole);

  await ensureDir(outputDir);

  await extractAudios(videoPath, outputPath);

  return outputPath;
}

module.exports = saveExtractedAudios;
