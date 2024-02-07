const sharp = require("sharp");

const BLACK_THRESHOLD = 11;
const MOVEMENT_THRESHOLD = 0.09;

async function detectMovement(imagePath) {
  const { data, info } = await sharp(imagePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let blackPixelCount = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    if (
      red < BLACK_THRESHOLD &&
      green < BLACK_THRESHOLD &&
      blue < BLACK_THRESHOLD
    ) {
      blackPixelCount += 1;
    }
  }

  const blackRatio = blackPixelCount / (info.width * info.height);

  if (blackRatio > MOVEMENT_THRESHOLD) {
    return true;
  }

  return false;
}

module.exports = detectMovement;
