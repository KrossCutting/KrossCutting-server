/* eslint-disable no-await-in-loop */
const path = require("path");
const fs = require("fs").promises;
const sharp = require("sharp");

const findBlackArea = require("./detectMovement");

const frameContentsDirectory = path.join(__dirname, "../temp/frames");

const LOW_FRAME_WIDTH = 250;
const LOW_FRAME_HEIGHT = 250;
const BLACK_THRESHOLD = 20;

async function ensureDir(fileDirectory) {
  try {
    await fs.access(fileDirectory);
  } catch (err) {
    await fs.mkdir(fileDirectory, { recursive: true });
  }
}

async function detectSingleShot(folderName) {
  const currentFileDirectory = path.join(frameContentsDirectory, folderName);
  const frameList = await fs.readdir(currentFileDirectory);

  frameList.sort(
    (a, b) =>
      parseInt(a.split("_").pop(), 10) - parseInt(b.split("_").pop(), 10),
  );

  const framesForCompare = [];

  for (
    let indexOf30fps = 0;
    indexOf30fps < frameList.length - 1;
    indexOf30fps += 30
  ) {
    const targetFramePath = path.join(
      currentFileDirectory,
      frameList[indexOf30fps],
    );

    framesForCompare.push(targetFramePath);
  }

  const outputFileDirectory = path.join(
    __dirname,
    `../temp/difference/${folderName}`,
  );

  await ensureDir(outputFileDirectory);

  const blackAreaArrayList = [];

  for (
    let indexOf1fps = 0;
    indexOf1fps < framesForCompare.length - 1;
    indexOf1fps += 1
  ) {
    const currentFramePath = framesForCompare[indexOf1fps];
    const nextFramePath = framesForCompare[indexOf1fps + 1];

    const frameNumber = parseInt(
      path.basename(currentFramePath).split("_").pop(),
      10,
    );

    const outputFileName = `difference_${frameNumber}.jpg`;
    const outputPath = path.join(outputFileDirectory, outputFileName);

    try {
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

      for (let i = 0; i < data.length; i += info.channels) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];

        const isDark =
          red < BLACK_THRESHOLD &&
          green < BLACK_THRESHOLD &&
          blue < BLACK_THRESHOLD;
        const colorValue = isDark ? 0 : 255;

        red = colorValue;
        green = colorValue;
        blue = colorValue;
      }

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

      if (await findBlackArea(outputPath)) {
        blackAreaArrayList.push(outputPath);
      }
    } catch (err) {
      console.error("프레임 처리 중 오류:", indexOf1fps, err);
    }
  }

  return blackAreaArrayList;
}

module.exports = detectSingleShot;
