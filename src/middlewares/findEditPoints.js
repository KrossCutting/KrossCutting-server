/* eslint-disable no-await-in-loop */
const path = require("path");
const fs = require("fs").promises;

const select1fpsFrames = require("../util/select1fpsFrames");
const analyzeDuration = require("../services/analyzeDuration");
const detectSingleShots = require("../services/detectSingleShots");
const detectFace = require("../services/detectFace");
const detectMovement = require("../services/detectMovement");
const progressStatus = require("../routes/progressStatus");

const { TEMP_DIR_FRAMES } = require("../constants/paths");

async function findEditPoints(req, res, next) {
  const { videoCount } = res.locals;
  const folderList =
    videoCount === 2
      ? ["main-contents", "sub-one-contents"]
      : ["main-contents", "sub-one-contents", "sub-two-contents"];

  let editPoints = {};
  const singleShots = {};

  progressStatus.stage = "editpoints";

  for (let videoType = 0; videoType < folderList.length; videoType += 1) {
    const folderName = folderList[videoType];
    const currentFrameDirectory = path.join(TEMP_DIR_FRAMES.FOLDER, folderName);
    const currentFrameFiles = await fs.readdir(currentFrameDirectory);
    const currentFramePathList = currentFrameFiles.map((frameName) =>
      path.join(currentFrameDirectory, frameName),
    );

    currentFramePathList.sort((a, b) => {
      const currentFramePath = parseInt(path.basename(a).split("_").pop(), 10);
      const nextFramePath = parseInt(path.basename(b).split("_").pop(), 10);

      return currentFramePath - nextFramePath;
    });

    const filtered1fpsPathList = select1fpsFrames(currentFramePathList);

    const detectedFacePromiseList = await Promise.allSettled(
      filtered1fpsPathList.map((framePath) => detectFace(framePath)),
    );

    const faceResultOfAllFrames = detectedFacePromiseList
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const movementRatioOfAllFrames = await detectMovement(
      filtered1fpsPathList,
      folderName,
    );

    const singleShotFrameList = detectSingleShots(
      faceResultOfAllFrames,
      movementRatioOfAllFrames,
    );

    if (folderName === "main-contents") {
      const mainSingleShotEditDuration = await analyzeDuration(
        singleShotFrameList,
        faceResultOfAllFrames,
        movementRatioOfAllFrames,
      );

      editPoints = mainSingleShotEditDuration;
    }

    singleShots[folderName] = singleShotFrameList;
  }

  res.locals.editPoints = editPoints;
  res.locals.singleShots = singleShots;

  next();
}

module.exports = findEditPoints;
