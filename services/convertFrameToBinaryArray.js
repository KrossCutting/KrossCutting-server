/* eslint-disable */
const path = require("path");
const sharp = require("sharp");

async function convertFrameToBinaryArray(imageNumber) {
  // To DO 수진님 코드 머지되면 상수처리된 path 사용해서 코드 길이 줄이기
  const mainFramePath = path.join(__dirname, `../temp/difference/main-contents/difference_${imageNumber}.jpg`);
  const subOneFramePath = path.join(__dirname, `../temp/difference/sub-one-contents/difference_${imageNumber}.jpg`);
  const subTwoFramePath = path.join(__dirname, `../temp/difference/sub-two-contents/difference_${imageNumber}.jpg`);

  const pathList = [mainFramePath, subOneFramePath, subTwoFramePath].map(async (framePath) => {
    const { data, info } = await sharp(framePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const binaryArray = new Array(info.height).fill(null).map(() => new Array(info.width).fill(0));

    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        const index = (y * info.width + x) * info.channels;
        binaryArray[y][x] = data[index] === 0 ? 0 : 1;
      }
    }

    return binaryArray.flat();
  });

  const binaryArrayList = await Promise.all(pathList);

  return binaryArrayList;
}

module.exports = convertFrameToBinaryArray;
