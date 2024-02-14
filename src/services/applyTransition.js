const sharp = require("sharp");
const fs = require("fs").promises;

const parseImgPath = require("../util/parseImgPath");
const stringifyImgPath = require("../util/stringifyImgPath");
const applyDissolve = require("./applyDissolve");

async function applyTransition(
  subImgPath,
  durationTime,
  extractArguments,
  imgMetadata,
) {
  const { frameNumber, videoLabel: subVideoLabel } = parseImgPath(subImgPath);
  const resizeFramePathList = new Array(durationTime * 30)
    .fill(0)
    .map((_, index) => {
      const mainFramePath = stringifyImgPath(
        "main-contents",
        frameNumber + index,
      );
      const subFramePath = stringifyImgPath(subVideoLabel, frameNumber + index);

      return [mainFramePath, subFramePath];
    });

  const resizePromiseList = resizeFramePathList.map(
    async ([_, subFramePath]) => {
      const imgBuffer = await sharp(subFramePath)
        .extract(extractArguments)
        .resize(imgMetadata.width, imgMetadata.height)
        .toBuffer();

      await fs.writeFile(subFramePath, imgBuffer);

      return subFramePath;
    },
  );

  await Promise.all(resizePromiseList);

  const dissolveStartList = new Array(2).fill(0).map((_, index) => {
    const mainFramePath = stringifyImgPath(
      "main-contents",
      frameNumber + index,
    );
    const subFramePath = stringifyImgPath(subVideoLabel, frameNumber + index);

    return [mainFramePath, subFramePath];
  });

  const dissolveStartPromiseList = dissolveStartList.map(
    async ([mainFramePath, subFramePath]) => {
      await applyDissolve(mainFramePath, subFramePath);

      return subFramePath;
    },
  );

  await Promise.all(dissolveStartPromiseList);

  const replaceFramesPromiseList = resizeFramePathList.map(
    async ([mainFramePath, subFramePath]) => {
      await fs.copyFile(subFramePath, mainFramePath);

      return subFramePath;
    },
  );

  await Promise.all(replaceFramesPromiseList);
}

module.exports = applyTransition;
