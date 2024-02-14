const fs = require("fs").promises;

const stringifyImgPath = require("../util/stringifyImgPath");
const parseImgPath = require("../util/parseImgPath");

function replaceFrames(subImg, durationTime) {
  const { frameNumber, videoLabel: subVideoLabel } = parseImgPath(subImg);
  const transferFrameList = new Array(durationTime * 30)
    .fill(0)
    .map((_, index) => {
      const mainFramePath = stringifyImgPath(
        "main-contents",
        frameNumber + index,
      );
      const subFramePath = stringifyImgPath(subVideoLabel, frameNumber + index);

      return [mainFramePath, subFramePath];
    });
  const transferFramePromiseList = transferFrameList.map(
    async ([mainFramePath, subFramePath]) => {
      await fs.copyFile(subFramePath, mainFramePath);

      return mainFramePath;
    },
  );

  return transferFramePromiseList;
}

module.exports = replaceFrames;
