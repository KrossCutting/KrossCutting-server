const fs = require("fs").promises;
const sharp = require("sharp");

const stringifyImgPath = require("../util/stringifyImgPath");

async function applyDissolveOneFrame(previousFramePath, currentFramePath) {
  const dissolvedBuffer = await sharp(previousFramePath)
    .modulate({ brightness: 0.9 })
    .composite([
      {
        input: currentFramePath,
        blend: "overlay",
        opacity: 0.7,
      },
    ])
    .toBuffer();

  await fs.writeFile(currentFramePath, dissolvedBuffer);
}

function applyDissolve(frameNumber, subVideoLabel, DISSOLVE_FRAME) {
  const dissolveList = new Array(DISSOLVE_FRAME).fill(0).map((_, index) => {
    const mainFramePath = stringifyImgPath(
      "main-contents",
      frameNumber + index,
    );
    const subFramePath = stringifyImgPath(subVideoLabel, frameNumber + index);

    return [mainFramePath, subFramePath];
  });

  const dissolvePromiseList = dissolveList.map(
    async ([mainFramePath, subFramePath]) => {
      await applyDissolveOneFrame(mainFramePath, subFramePath);

      return subFramePath;
    },
  );

  return dissolvePromiseList;
}

module.exports = applyDissolve;
