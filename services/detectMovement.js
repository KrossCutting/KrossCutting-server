const sharp = require("sharp");

async function findBlackArea(imagePath) {
  const { data, info } = await sharp(imagePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let blackPixelCount = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    if (red < 11 && green < 11 && blue < 11) {
      blackPixelCount += 1;
    }
  }

  const blackRatio = blackPixelCount / (info.width * info.height);

  if (blackRatio > 0.09) {
    return true;
  }

  return false;
}

module.exports = findBlackArea;
