/* eslint-disable */
const path = require("path");
const sharp = require("sharp");
const { TEMP_DIR_DIFFERENCE } = require("../constants/paths");

async function convertFrameToBinaryArray(imageNumber) {
  const mainFramePath = path.join(TEMP_DIR_DIFFERENCE.MAIN, `./difference_${imageNumber}.jpg`);
  const subOneFramePath = path.join(TEMP_DIR_DIFFERENCE.SUB_ONE, `./difference_${imageNumber}.jpg`);
  const subTwoFramePath = path.join(TEMP_DIR_DIFFERENCE.SUB_TWO, `./difference_${imageNumber}.jpg`);

  const pathList = [mainFramePath, subOneFramePath, subTwoFramePath].map(async (framePath) => {
    const { data, info } = await sharp(framePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const binaryArray = new Array(info.height * info.width).fill(1);

    for (let i = 0; i < data.length; i += info.channels) {
      binaryArray[Math.floor(i / info.channels)] = data[i] === 0 ? 0 : 1;
    }

    return binaryArray;
  });

  const binaryArrayList = await Promise.all(pathList);

  return binaryArrayList;
}

module.exports = convertFrameToBinaryArray;
