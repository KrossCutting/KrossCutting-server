const tf = require("@tensorflow/tfjs-node");
const blazeface = require("@tensorflow-models/blazeface");
const fs = require("fs").promises;

let faceDetectionModel = null;

async function loadFaceModel() {
  if (!faceDetectionModel) {
    faceDetectionModel = await blazeface.load();
  }

  return faceDetectionModel;
}

async function detectFace(framePath) {
  try {
    const faceModel = await loadFaceModel();
    const frameImage = await fs.readFile(framePath);
    const decodedFrameImage = tf.node.decodeImage(frameImage);
    const predictions = await faceModel.estimateFaces(decodedFrameImage, false);

    tf.dispose(decodedFrameImage);

    return {
      framePath,
      predictions,
    };
  } catch (error) {
    console.error(
      `Error detecting face in image ${framePath}: ${error.message}`,
    );

    return { framePath, predictions: [] };
  }
}

module.exports = detectFace;
