const { createCanvas, loadImage } = require("canvas");
const blazeface = require("@tensorflow-models/blazeface");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs").promises;

async function getFaceCoordinate(faceImgPath) {
  let pixels;

  try {
    // TO DO: 파일 있는지 확인

    const faceImgBuffer = await fs.readFile(faceImgPath);
    const loadedFaceImg = await loadImage(faceImgBuffer);
    const canvas = createCanvas(loadedFaceImg.width, loadedFaceImg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      loadedFaceImg,
      0,
      0,
      loadedFaceImg.width,
      loadedFaceImg.height,
    );

    const faceModel = await blazeface.load();

    pixels = tf.browser.fromPixels(canvas);

    const predictions = await faceModel.estimateFaces(pixels, false);

    if (predictions.length > 1) {
      predictions.sort((previous, current) => {
        const {
          topLeft: [prevLeftX, prevTopY],
          bottomRight: [prevRightX, prevBottomY],
        } = previous;
        const {
          topLeft: [curLeftX, curTopY],
          bottomRight: [curRightX, curBottomY],
        } = current;

        const prevArea = (prevRightX - prevLeftX) * (prevBottomY - prevTopY);
        const curArea = (curRightX - curLeftX) * (curBottomY - curTopY);

        return curArea - prevArea;
      });
    }

    if (predictions.length === 0) {
      return null;
    }

    tf.dispose(pixels);

    return predictions[0];
  } catch (err) {
    tf.dispose(pixels);

    console.error(`에러 발생 ${err}`);

    return null;
  }
}

module.exports = getFaceCoordinate;
