const path = require("path");
const fs = require("fs").promises;

const select1fpsFrames = require("../../util/select1fpsFrames");
const analyzeDuration = require("../../services/analyzeDuration");
const detectSingleShots = require("../../services/detectSingleShots");
const detectFace = require("../../services/detectFace");
const detectMovement = require("../../services/detectMovement");

const frameContentsDirectory = path.join(__dirname, "../../temp/frames");

async function getSingleShotFrames(req, res, next) {
  // TODO. 컨트롤러로 위치하였으나 추후 미들웨어로 변경됩니다.
  /*
    mockup 데이터로 작업시, 아래 단계에 따라 파일을 실행해주세요.
    1. function (req, res, next)을 function (folderName)으로 변경
    2. const folderName = req.contentTitle;은 주석처리
    3. getSingleShotFrames("main-contents");와 같이 폴더명을 넣어 스크립트 아래에서 실행해주세요.
  */
  const folderName = req.contentTitle;
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

  const detectedFacePromiseList = await Promise.allSettled(
    filteredFramePathList.map((framePath) => detectFace(framePath)),
  );

  const detectedFaceResultOfAllFrames = detectedFacePromiseList
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const detectedMovementRatioOfAllFrames = await detectMovement(
    filteredFramePathList,
    folderName,
  );

  const singleShotFrameList = detectSingleShots(
    detectedMovementRatioOfAllFrames,
    detectedFaceResultOfAllFrames,
  );

  if (folderName === "main-contents") {
    const mainSingleShotEditDuration = await analyzeDuration(
      singleShotFrameList,
      detectedFaceResultOfAllFrames,
      detectedMovementRatioOfAllFrames,
    );

    return { singleShotFrameList, mainSingleShotEditDuration };
  }

  return singleShotFrameList;
}

module.exports = getSingleShotFrames;
