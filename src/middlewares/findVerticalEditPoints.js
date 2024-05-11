/* eslint-disable no-await-in-loop */
const path = require("path");
const fs = require("fs").promises;
const sharp = require("sharp");

const select1fpsFrames = require("../util/select1fpsFrames");
const analyzeVerticalDuration = require("../services/analyzeVerticalDuration");
const detectVerticalSingleShots = require("../services/detectVerticalSingleShots");
const detectVerticalMovement = require("../services/detectVerticalMovement");
const progressStatus = require("../routes/progressStatus");

const { TEMP_DIR_FRAMES } = require("../constants/paths");

async function findVerticalEditPoints(req, res, next) {
  progressStatus.stage = "editPoints";
  const { videoCount } = res.locals;
  const folderList =
    videoCount === 2
      ? ["main-contents", "sub-one-contents"]
      : ["main-contents", "sub-one-contents", "sub-two-contents"];

  let editPoints = {};
  const singleShots = {};

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

    const metadata = await sharp(filtered1fpsPathList[0]).metadata();
    const { width } = metadata;
    const dividedByThree = Math.floor(width / 3);
    const LOW_FRAME_WIDTH = dividedByThree - 10;
    const LOW_FRAME_HEIGHT = metadata.height;

    const movementRatioOfAllFrames = await detectVerticalMovement(
      filtered1fpsPathList,
      folderName,
      LOW_FRAME_WIDTH,
      LOW_FRAME_HEIGHT,
    );

    const [singleShotFrameList, nonSelectedFramesMovementAvg] =
      detectVerticalSingleShots(movementRatioOfAllFrames);

    if (folderName === "main-contents") {
      const mainSingleShotEditDuration = await analyzeVerticalDuration(
        singleShotFrameList,
        movementRatioOfAllFrames,
        nonSelectedFramesMovementAvg,
      );

      editPoints = mainSingleShotEditDuration;
    }

    singleShots[folderName] = singleShotFrameList;
  }

  res.locals.editPoints = editPoints;
  res.locals.singleShots = singleShots;

  next();
}

module.exports = findVerticalEditPoints;
