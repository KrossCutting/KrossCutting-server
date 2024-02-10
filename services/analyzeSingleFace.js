function analyzeSingleFace(framePredictionResult) {
  const { framePath, predictions } = framePredictionResult;

  if (predictions.length === 1) {
    const PROBABILITY_RATE_THRESHOLD = 0.95;
    const face = predictions[0];

    if (face.probability[0] >= PROBABILITY_RATE_THRESHOLD) {
      return framePath;
    }
  }

  return null;
}

module.exports = analyzeSingleFace;
