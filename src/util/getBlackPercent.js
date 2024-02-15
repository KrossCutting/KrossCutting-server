const validateArrays = require("./validateArrays");

const BLACK = 0;

function getBlackPercent(comparisonArray) {
  validateArrays(comparisonArray);

  const matchedBlack = comparisonArray.reduce((blackSpots, spot, index) => {
    if (spot === BLACK) {
      return blackSpots + 1;
    }

    return blackSpots;
  }, 0);

  return matchedBlack / comparisonArray.length;
}

module.exports = getBlackPercent;
