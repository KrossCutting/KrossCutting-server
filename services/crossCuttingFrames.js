const sharp = require("sharp");
const fs = require("fs").promises;

const detectFace = require("./detectFace");
const resizeAndDissolve = require("./resizeAndDissolve");

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

async function crossCuttingFrames(mainImg, subImg, durationTime) {
  try {
    const mainFaceData = await detectFace(mainImg);
    const subFaceData = await detectFace(subImg);
    const isNotExistFaceImg =
      !mainFaceData.predictions ||
      !subFaceData.predictions ||
      !mainFaceData.predictions.length ||
      !subFaceData.predictions.length;

    if (isNotExistFaceImg) {
      console.log("조회된 얼굴이 없습니다.");

      return null;
    }

    const mainFaceCoord = mainFaceData.predictions[0];
    const subFaceCoord = subFaceData.predictions[0];
    const imgMetadata = await sharp(mainImg).metadata();

    if (!isSamePositionFace(mainFaceCoord, subFaceCoord, imgMetadata)) {
      console.log("같은 얼굴이 아닙니다.  임의로 사이즈를 조정합니다.");

      const {
        topLeft: [mainLeftX, _1],
        bottomRight: [mainRightX, _2],
      } = mainFaceCoord;
      const {
        topLeft: [subLeftX, _3],
        bottomRight: [subRightX, _4],
      } = subFaceCoord;

      const widthMain = mainRightX - mainLeftX;
      const widthSub = subRightX - subLeftX;
      const ratio = widthMain / widthSub;

      if (ratio > 1) {
        const imgBuffer = await sharp(subImg)
          .resize(
            Math.floor(imgMetadata.width * ratio),
            Math.floor(imgMetadata.height * ratio),
          )
          .extract({
            top: Math.floor(((ratio - 1) * imgMetadata.width) / 2),
            left: Math.floor(((ratio - 1) * imgMetadata.height) / 2),
            width: imgMetadata.width,
            height: imgMetadata.height,
          })
          .toBuffer();

        await fs.writeFile(subImg, imgBuffer);

        return null;
      }
    }

    const extractArguments = cutFrameArguments(
      mainFaceCoord,
      subFaceCoord,
      imgMetadata,
    );

    await resizeAndDissolve(
      subImg,
      durationTime,
      extractArguments,
      imgMetadata,
    );

    return null;
  } catch (faceDetectError) {
    console.error(`얼굴 좌표 연산 중 에러 발생 ${faceDetectError}`);

    return null;
  }
}

module.exports = crossCuttingFrames;
