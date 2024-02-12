const path = require("path");

function parseImgPath(imgPath) {
  const filePath = path.dirname(imgPath);
  const fileName = path.basename(imgPath);
  const pathSep = path.sep;

  const frameNumber = parseInt(fileName.split("_").pop(), 10);
  const videoLabel = filePath.split(pathSep).pop();

  return {
    frameNumber,
    videoLabel,
  };
}

module.exports = parseImgPath;
