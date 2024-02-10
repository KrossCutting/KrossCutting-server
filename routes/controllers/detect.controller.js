const path = require("path");
const fs = require("fs").promises;

const getSingleFaceFrames = require("../../services/getSingleFaceFrames");
const getSingleMovementFrames = require("../../services/getSingleMovementFrames");
const select1fpsFrames = require("../../util/select1fpsFrames");
const analyzeDuration = require("../../services/analyzeDuration");

const frameContentsDirectory = path.join(__dirname, "../../temp/frames");

async function getSingleShotFrames(req, res, next) {
  // TODO. detect관련 서비스들이 실행됩니다.
  // 컨트롤러로 위치하였으나 추후 로직 연결에 따라 변경될 수 있습니다.

  /*
    mockup 데이터로 작업시, 아래 단계에 따라 파일을 실행해주세요.
    1. function (req, res, next)을 function (folderName)으로 변경
    2. const folderName = req.contentTitle;은 주석처리
    3. getSingleShotFrames("main-contents");와 같이 폴더명을 넣어 스크립트 아래에서 실행해주세요.
  */

  const folderName = req.contentTitle;
  // 이후 컨트롤러 사용시 요청에 폴더명을 설정하여 전달해야합니다.
  const currentFrameDirectory = path.join(frameContentsDirectory, folderName);
  const currentFrameFiles = await fs.readdir(currentFrameDirectory);
  const currentFramePathList = currentFrameFiles.map((frame) =>
    path.join(currentFrameDirectory, frame),
  );

  currentFramePathList.sort((a, b) => {
    const currentFramePath = parseInt(path.basename(a).split("_").pop(), 10);
    const nextFramePath = parseInt(path.basename(b).split("_").pop(), 10);

    return currentFramePath - nextFramePath;
  });

  const filteredFramePathList = select1fpsFrames(currentFramePathList);

  const detectedFaceFrameNumbers = await getSingleFaceFrames(
    filteredFramePathList,
  );

  const detectedSingleMovementFrameNumbers = await getSingleMovementFrames(
    filteredFramePathList,
    folderName,
  );

  const filteredSingleShotFrames = detectedSingleMovementFrameNumbers.filter(
    (number) => {
      return detectedFaceFrameNumbers.includes(number);
    },
  );

  return filteredSingleShotFrames;
}

module.exports = getSingleShotFrames;
