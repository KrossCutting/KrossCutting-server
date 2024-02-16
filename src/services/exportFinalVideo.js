const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const {
  TEMP_DIR_FRAMES,
  TEMP_DIR_WAV_ADJUSTED,
  TEMP_DIR_VIDEOS,
} = require("../constants/paths");

function exportFinalVideo() {
  return new Promise((resolve, reject) => {
    const finalVideoPath = path.join(TEMP_DIR_VIDEOS.FOLDER, "finalVideo.mp4");
    const finalAudioPath = path.join(
      TEMP_DIR_WAV_ADJUSTED.MAIN,
      "main-audio.wav",
    );
    const inputVideoPattern = path.join(
      TEMP_DIR_FRAMES.MAIN,
      "frame_30fps_%d.jpg",
    );
    const SCALE = "1280: 720";

    ffmpeg()
      .input(inputVideoPattern)
      .inputFPS(30)
      .inputFormat("image2")
      .input(finalAudioPath)
      .videoCodec("libx264")
      .outputOptions([
        "-pix_fmt yuv420p",
        `-vf scale=${SCALE}`,
        "-crf 23",
        "-b:a 128k",
      ])
      .on("end", () => {
        console.log("최종 비디오가 편집 완료되었습니다.");

        resolve();
      })
      .on("error", (err) => {
        console.error(`에러발생 ${err}`);

        reject();
      })
      .save(finalVideoPath);
  });
}

module.exports = exportFinalVideo;
