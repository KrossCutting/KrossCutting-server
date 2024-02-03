const fs = require("fs");
const path = require("path");

const convertPath = require("../../services/convertPath");
const extractFramesFromVideo = require("../../services/extractFramesFromVideo");

exports.videoToFrame = function (req, res, next) {
  const tempDirectory = path.join(__dirname, "../../temp");
  const videoTotalPathList = Object.entries(req.body.videoUrlList);
  const startPointsList = Object.values(req.body.startPoints);

  videoTotalPathList.forEach(([folderPath, filePath], index) => {
    const videoPath = path.join(
      tempDirectory,
      `videos/${convertPath(folderPath)}/${filePath}`,
    );
    const framesFolderPath = path.join(
      tempDirectory,
      `frames/${convertPath(folderPath)}`,
    );
    const startTime = startPointsList[index];

    if (!fs.existsSync(framesFolderPath)) {
      fs.mkdirSync(framesFolderPath, { recursive: true });
    }

    extractFramesFromVideo(videoPath, framesFolderPath, startTime, 1);
  });

  // TO DO: 여기에서, 응답이 아닌 다음 프로세스 컨트롤러를 연결해야 합니다.
  console.log("complete!");
};
