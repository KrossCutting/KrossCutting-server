const sharp = require("sharp");

const parseImgPath = require("../util/parseImgPath");
const detectFace = require("./detectFace");
const applyTransition = require("./applyTransition");
const applyDissolve = require("./applyDissolve");
const replaceFrames = require("./replaceFrames");

function cutFrameArguments(mainCoord, subCoord, imgMetadata) {
  const {
    topLeft: [mainLeftX, mainTopY],
    bottomRight: [mainRightX, mainBottomY],
  } = mainCoord;
  const {
    topLeft: [subLeftX, subTopY],
    bottomRight: [subRightX, subBottomY],
  } = subCoord;
  const mainFaceCoord = {
    x: (mainLeftX + mainRightX) / 2,
    y: (mainTopY + mainBottomY) / 2,
  };
  const subFaceCoord = {
    x: (subLeftX + subRightX) / 2,
    y: (subTopY + subBottomY) / 2,
  };

  if (mainFaceCoord.x > subFaceCoord.x) {
    if (mainFaceCoord.y > subFaceCoord.y) {
      const resizeWidth = Math.floor(
        imgMetadata.width - (mainFaceCoord.x - subFaceCoord.x),
      );
      const resizeHeight = Math.floor(
        imgMetadata.height - (mainFaceCoord.y - subFaceCoord.y),
      );

      return {
        left: 0,
        top: 0,
        width: resizeWidth,
        height: resizeHeight,
      };
    }
    const resizeWidth = Math.floor(
      imgMetadata.width - (mainFaceCoord.x - subFaceCoord.x),
    );
    const resizeHeight = Math.floor(
      imgMetadata.height - (subFaceCoord.y - mainFaceCoord.y),
    );

    return {
      left: 0,
      top: Math.floor(subFaceCoord.y - mainFaceCoord.y),
      width: resizeWidth,
      height: resizeHeight,
    };
  }

  if (mainFaceCoord.y > subFaceCoord.y) {
    const resizeWidth = Math.floor(
      imgMetadata.width - (subFaceCoord.x - mainFaceCoord.x),
    );
    const resizeHeight = Math.floor(
      imgMetadata.height - (mainFaceCoord.y - subFaceCoord.y),
    );

    return {
      left: Math.floor(subFaceCoord.x - mainFaceCoord.x),
      top: 0,
      width: resizeWidth,
      height: resizeHeight,
    };
  }
  const resizeWidth = Math.floor(
    imgMetadata.width - (subFaceCoord.x - mainFaceCoord.x),
  );
  const resizeHeight = Math.floor(
    imgMetadata.height - (subFaceCoord.y - mainFaceCoord.y),
  );

  return {
    left: Math.floor(subFaceCoord.x - mainFaceCoord.x),
    top: Math.floor(subFaceCoord.y - mainFaceCoord.y),
    width: resizeWidth,
    height: resizeHeight,
  };
}

function isSamePositionFace(mainCoord, subCoord, imgMetadata) {
  const {
    topLeft: [mainLeftX, mainTopY],
    bottomRight: [mainRightX, mainBottomY],
  } = mainCoord;
  const {
    topLeft: [subLeftX, subTopY],
    bottomRight: [subRightX, subBottomY],
  } = subCoord;
  const mainFaceCoord = {
    x: (mainLeftX + mainRightX) / 2,
    y: (mainTopY + mainBottomY) / 2,
  };
  const subFaceCoord = {
    x: (subLeftX + subRightX) / 2,
    y: (subTopY + subBottomY) / 2,
  };

  const widthDiff =
    Math.abs(mainFaceCoord.x - subFaceCoord.x) > imgMetadata.width / 4;
  const heightDiff =
    Math.abs(mainFaceCoord.y - subFaceCoord.y) > imgMetadata.height / 4;

  return !(widthDiff || heightDiff);
}

async function editFrames(mainImg, subImg, durationTime) {
  try {
    const mainFaceData = await detectFace(mainImg);
    const subFaceData = await detectFace(subImg);
    const { frameNumber, videoLabel: subVideoLabel } = parseImgPath(subImg);
    const isNotExistFaceImg =
      !mainFaceData.predictions.length || !subFaceData.predictions.length;

    if (isNotExistFaceImg) {
      console.log("조회된 얼굴이 없습니다.");

      await Promise.all(applyDissolve(frameNumber, subVideoLabel, 1));
      await Promise.all(replaceFrames(subImg, durationTime));

      return;
    }

    const mainFaceCoord = mainFaceData.predictions[0];
    const subFaceCoord = subFaceData.predictions[0];
    const imgMetadata = await sharp(mainImg).metadata();

    if (!isSamePositionFace(mainFaceCoord, subFaceCoord, imgMetadata)) {
      console.log("같은 위치의 얼굴이 아닙니다.");

      await Promise.all(applyDissolve(frameNumber, subVideoLabel, 1));
      await Promise.all(replaceFrames(subImg, durationTime));

      return;
    }

    const extractArguments = cutFrameArguments(
      mainFaceCoord,
      subFaceCoord,
      imgMetadata,
    );

    await applyTransition(subImg, durationTime, extractArguments, imgMetadata);
  } catch (faceDetectError) {
    console.error(`얼굴 좌표 연산 중 에러 발생 ${faceDetectError}`);
  }
}

module.exports = editFrames;
