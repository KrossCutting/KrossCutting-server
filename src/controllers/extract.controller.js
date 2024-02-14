const fs = require("fs");
const path = require("path");

const convertPath = require("../services/convertPath");

const extractFramesFromVideo = require("../services/extractFramesFromVideo");
const { TEMP_DIR_VIDEOS, TEMP_DIR_FRAMES } = require("../constants/paths");

exports.videoToFrame = async function (req, res, next) {
  try {
    const videoPathList = Object.entries(req.body.videoUrls);
    const startPointList = Object.values(req.body.startPoints);

    const videoPromiseLists = videoPathList.map(
      ([folderPath, filePath], index) => {
        const videoPath = path.join(
          TEMP_DIR_VIDEOS.FORDER,
          `./${convertPath(folderPath)}/${filePath}`,
        );
        const framesFolderPath = path.join(
          TEMP_DIR_FRAMES.FORDER,
          `./${convertPath(folderPath)}`,
        );
        const startTime = startPointList[index];

        if (!fs.existsSync(framesFolderPath)) {
          fs.mkdirSync(framesFolderPath, { recursive: true });
        }

        return extractFramesFromVideo(
          videoPath,
          framesFolderPath,
          startTime,
          30,
        );
      },
    );

    // TO DO: 프로미스 배열 상태확인 후 reject 있을 시 에러 처리 필요
    await Promise.allSettled(videoPromiseLists);
  } catch (err) {
    console.error(err);
  }
  // TO DO: 여기에서, 응답이 아닌 다음 프로세스 컨트롤러를 연결해야 합니다.
};
