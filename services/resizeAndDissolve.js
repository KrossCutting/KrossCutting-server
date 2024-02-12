const sharp = require("sharp");
const fs = require("fs").promises;

const parseImgPath = require("../util/parseImgPath");
const stringifyImgPath = require("../util/stringifyImgPath");
const dissolveFrames = require("./dissolveFrames");

async function resizeAndDissolve(
  subImgPath,
  durationTime,
  extractArguments,
  imgMetadata,
) {
  const { frameNumber, videoLabel: subVideoLabel } = parseImgPath(subImgPath);
  const resizeImgPathList = new Array(durationTime * 30)
    .fill(0)
    .map((_, index) => {
      return stringifyImgPath(subVideoLabel, frameNumber + index);
    });

  const resizePromiseList = resizeImgPathList.map(async (imgPath) => {
    const imgBuffer = await sharp(imgPath)
      .extract(extractArguments)
      .resize(imgMetadata.width, imgMetadata.height)
      .toBuffer();

    await fs.writeFile(imgPath, imgBuffer);

    return imgPath;
  });

  await Promise.allSettled(resizePromiseList);

  const dissolveStartList = new Array(3).fill(0).map((_, index) => {
    const mainFramePath = stringifyImgPath(
      "main-contents",
      frameNumber + index,
    );
    const subFramePath = stringifyImgPath(subVideoLabel, frameNumber + index);

    return [mainFramePath, subFramePath];
  });

  const dissolveStartPromiseList = dissolveStartList.map(
    async ([main, sub]) => {
      const resultImgPath = await dissolveFrames(main, sub);

      return resultImgPath;
    },
  );

  await Promise.allSettled(dissolveStartPromiseList);
}

module.exports = resizeAndDissolve;
