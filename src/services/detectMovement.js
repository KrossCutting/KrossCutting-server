/* eslint-disable no-await-in-loop */
const path = require("path");
const sharp = require("sharp");

const ensureDir = require("../util/ensureDir");
const analyzeMovementRatio = require("./analyzeMovementRatio");

const LOW_FRAME_WIDTH = 250;
const LOW_FRAME_HEIGHT = 250;

async function detectMovement(filteredFramePathList, folderName) {
  const outputFileDirectory = path.join(
    __dirname,
    `../temp/difference/${folderName}`,
  );

  await ensureDir(outputFileDirectory);

  const detectedMovementRatioList = [];

  for (
    let indexOf1fps = 0;
    indexOf1fps < filteredFramePathList.length - 1;
    indexOf1fps += 1
  ) {
    const currentFramePath = filteredFramePathList[indexOf1fps];
    const nextFramePath = filteredFramePathList[indexOf1fps + 1];
    const frameNumber = parseInt(
      path.basename(currentFramePath).split("_").pop(),
      10,
    );

    const outputFileName = `difference_${frameNumber}.jpg`;
    const outputPath = path.join(outputFileDirectory, outputFileName);

    const currentLowFrame = sharp(currentFramePath)
      .resize(LOW_FRAME_WIDTH, LOW_FRAME_HEIGHT)
      .modulate({ saturation: 0.1 })
      .modulate({ brightness: 1.9 });

    const nextLowFrame = sharp(nextFramePath)
      .resize(LOW_FRAME_WIDTH, LOW_FRAME_HEIGHT)
      .modulate({ saturation: 0.1 })
      .modulate({ brightness: 1.9 });

    const resultOfDifference = await currentLowFrame
      .composite([
        { input: await nextLowFrame.toBuffer(), blend: "difference" },
      ])
      .modulate({ saturation: 3.0 })
      .toColourspace("b-w")
      .toBuffer();

    const { data, info } = await sharp(resultOfDifference)
      .raw()
      .toBuffer({ resolveWithObject: true });

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    })
      .resize(400, 400)
      .extract({ width: 200, height: 200, left: 100, top: 100 })
      .toFile(outputPath);

    const resultOfMovementRatio = await analyzeMovementRatio(outputPath);

    detectedMovementRatioList.push({
      path: currentFramePath,
      movementRatio: resultOfMovementRatio,
    });
  }

  return detectedMovementRatioList;
}

module.exports = detectMovement;
