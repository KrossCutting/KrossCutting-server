const { createCanvas, loadImage } = require("canvas");
const blazeface = require("@tensorflow-models/blazeface");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs").promises;

function getFaceCoordinate(imgPath) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const imgBuffer = await fs.readFile(imgPath);
      const img = await loadImage(imgBuffer);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const model = await blazeface.load();
      const input = tf.browser.fromPixels(canvas);
      const predictions = await model.estimateFaces(input, false);
      const faceCoordinates = [];

      predictions.forEach((prediction, index) => {
        faceCoordinates.push(prediction);
      });

      resolve(faceCoordinates[0]);
    } catch (err) {
      console.error(`Error: ${err}`);
      reject();
    }
  });
}

module.exports = getFaceCoordinate;
