const analyzeSingleFace = require("./analyzeSingleFace");
const detectFace = require("./detectFace");

async function getSingleFaceFrames(sortedFrameList) {
  const detectedFaceCountPromiseList = await Promise.allSettled(
    sortedFrameList.map((framePath) => detectFace(framePath)),
  );

  const detectedFaceCountResults = detectedFaceCountPromiseList
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const detectedSingleFaceList = detectedFaceCountResults.map(
    (framePredictionResult) => analyzeSingleFace(framePredictionResult),
  );

  const detectedFaceFrameNumbers = detectedSingleFaceList
    .filter((path) => path !== null)
    .map((framePath) => parseInt(framePath.split("_").pop(), 10));

  return detectedFaceFrameNumbers;
}

module.exports = getSingleFaceFrames;
