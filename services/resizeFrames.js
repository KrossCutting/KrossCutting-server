const sharp = require("sharp");
const fs = require("fs");

const detectFace = require("./detectFace");

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

function verifySamePositionFace(mainCoord, subCoord, imgMetadata) {
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

async function resizeFrames(mainImg, subImg) {
  try {
    const mainFaceCoord = await detectFace(mainImg).predictions[0];
    const subFaceCoord = await detectFace(subImg).predictions[0];
    const imgMetadata = await sharp(mainImg).metadata();

    if (!mainFaceCoord || !subFaceCoord) {
      console.log("조회된 얼굴이 없습니다.");

      return null;
    }

    if (!verifySamePositionFace(mainFaceCoord, subFaceCoord, imgMetadata)) {
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

      const [_, smaller] = ratio > 1 ? [mainImg, subImg] : [subImg, mainImg];
      const resizeRatio = ratio > 1 ? ratio : 1 / ratio;

      sharp(smaller)
        .resize(
          Math.floor(imgMetadata.width * resizeRatio),
          Math.floor(imgMetadata.height * resizeRatio),
        )
        .extract({
          top: Math.floor(((resizeRatio - 1) * imgMetadata.width) / 2),
          left: Math.floor(((resizeRatio - 1) * imgMetadata.height) / 2),
          width: imgMetadata.width,
          height: imgMetadata.height,
        })
        .toBuffer((err, buffer) => {
          if (err) {
            console.error(`이미지 생성 중 오류 발생: ${err.message}`);
          } else {
            fs.writeFile(smaller, buffer, (writeErr) => {
              if (writeErr) {
                console.error(`이미지 저장 중 오류 발생 ${writeErr.message}`);
              } else {
                console.log("성공적으로 이미지 저장 완료 되었습니다.");
              }
            });
          }
        });

      return null;
    }

    sharp(subImg)
      .extract(cutFrameArguments(mainFaceCoord, subFaceCoord, imgMetadata))
      .resize(imgMetadata.width, imgMetadata.height)
      .toBuffer((err, buffer) => {
        if (err) {
          console.error(`이미지 생성 중 오류 발생: ${err.message}`);
        } else {
          fs.writeFile(subImg, buffer, (writeErr) => {
            if (writeErr) {
              console.error(`이미지 저장 중 오류 발생 ${writeErr.message}`);
            } else {
              console.log("성공적으로 이미지 저장 완료 되었습니다.");
            }
          });
        }
      });

    return null;
  } catch (faceDetectError) {
    console.error(`얼굴 좌표 연산 중 에러 발생 ${faceDetectError}`);

    return null;
  }
}

module.exports = resizeFrames;
