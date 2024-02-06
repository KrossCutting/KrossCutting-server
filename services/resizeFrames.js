const sharp = require("sharp");

const getFaceCoordinate = require("./getFaceCoordinate");

async function calculateRatio(imgPath1, imgPath2) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const faceData1 = await getFaceCoordinate(imgPath1);
      const faceData2 = await getFaceCoordinate(imgPath2);

      if (!faceData1 || !faceData2) {
        console.log("조회된 얼굴이 없습니다");
        return;
      }

      const {
        topLeft: [leftX1, topY1],
        bottomRight: [rightX1, bottomY1],
      } = faceData1;

      const {
        topLeft: [leftX2, topY2],
        bottomRight: [rightX2, bottomY2],
      } = faceData2;

      const [width1, width2] = [rightX1 - leftX1, rightX2 - leftX2];
      resolve(width1 / width2);
    } catch (err) {
      reject();
    }
  });
}

async function resizeFrame(img1, img2) {
  const ratio = await calculateRatio(img1, img2);

  if (!ratio) {
    console.error("계산된 ratio가 없습니다");
    return;
  }

  const [bigger, smaller] = ratio > 1 ? [img1, img2] : [img2, img1];
  const metadataImg = await sharp(smaller).metadata();

  sharp(smaller)
    .resize({
      width: Math.round(metadataImg.width * ratio),
      height: Math.round(metadataImg.height * ratio),
    })
    .extract({
      width: metadataImg.width,
      height: metadataImg.height,
      left: Math.floor(((ratio - 1) * metadataImg.width) / 2),
      top: Math.floor(((ratio - 1) * metadataImg.height) / 2),
    })
    .toFile(smaller, (err, info) => {
      if (err) {
        console.error("이미지 생성 중 오류가 발생하였습니다.");
        console.error(err);
      } else {
        console.log("성공적으로 이미지가 생성되었습니다");
        console.log(info);
      }
    });
}

module.exports = resizeFrame;
