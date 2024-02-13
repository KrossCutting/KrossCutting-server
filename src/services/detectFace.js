const fs = require("fs").promises;
const tf = require("@tensorflow/tfjs-node");
const blazeface = require("@tensorflow-models/blazeface");

function loadFaceModel() {
  return blazeface.load();
}

async function detectFace(imagePath) {
  const faceDetectionModel = await loadFaceModel();
  const frameImage = await fs.readFile(imagePath);
  const decodedFrameImage = tf.node.decodeImage(frameImage);
  const returnTensors = false;
  const predictions = await faceDetectionModel.estimateFaces(
    decodedFrameImage,
    returnTensors,
  );

  tf.dispose(decodedFrameImage);

  return {
    framePath: imagePath,
    predictions,
  };
}

module.exports = detectFace;
