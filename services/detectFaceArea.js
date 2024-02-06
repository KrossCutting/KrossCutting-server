/* eslint-disable no-restricted-syntax, no-await-in-loop */
const path = require("path");
const fs = require("fs").promises;
const tf = require("@tensorflow/tfjs-node");
const blazeface = require("@tensorflow-models/blazeface");

const frameContentsDirectory = path.join(__dirname, "../temp/frames");

const PROBABILITY_RATE_THRESHOLD = 0.95;

function loadFaceModel() {
  return blazeface.load();
}

async function detectFace(imagePath, model) {
  const frameImage = await fs.readFile(imagePath);
  const decodedFrameImage = tf.node.decodeImage(frameImage);
  const returnTensors = false;
  const predictions = await model.estimateFaces(
    decodedFrameImage,
    returnTensors,
  );

  tf.dispose(decodedFrameImage);

  if (predictions.length === 1) {
    const face = predictions[0];

    if (face.probability[0] >= PROBABILITY_RATE_THRESHOLD) {
      return true;
    }
  }

  return false;
}

async function detectFaceInFrame(folderName) {
  const modelOfFaceDetection = await loadFaceModel();
  const currentFileDirectory = path.join(frameContentsDirectory, folderName);
  const frameList = await fs.readdir(currentFileDirectory);

  frameList.sort(
    (a, b) =>
      parseInt(a.split("_").pop(), 10) - parseInt(b.split("_").pop(), 10),
  );

  const framesForDetectFace = [];

  for (
    let indexOf30fps = 0;
    indexOf30fps < frameList.length - 1;
    indexOf30fps += 30
  ) {
    const framePathOf1fps = path.join(
      currentFileDirectory,
      frameList[indexOf30fps],
    );

    framesForDetectFace.push(framePathOf1fps);
  }

  const detectedFrames = [];

  for (const framePathOf1fps of framesForDetectFace) {
    const hasFace = await detectFace(framePathOf1fps, modelOfFaceDetection);

    if (hasFace) {
      detectedFrames.push(framePathOf1fps);
    }
  }

  return detectedFrames;
}

module.exports = detectFaceInFrame;
