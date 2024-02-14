const validateArrays = require("./validateArrays");

const BLACK = 0;

function getMatchedPercent(baseArray, comparisonArray) {
  validateArrays(baseArray, comparisonArray);

  if (baseArray.length !== comparisonArray.length) {
    throw new Error("given Arrays have different length");
  }

  const matchedBlack = baseArray.reduce((blackSpots, spot, index) => {
    if (spot === BLACK && comparisonArray[index] === BLACK) {
      return blackSpots + 1;
    }

    return blackSpots;
  }, 0);

  return matchedBlack / baseArray.length;
}

module.exports = getMatchedPercent;
