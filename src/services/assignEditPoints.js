/* eslint-disable */
const distributeFrames = require("../services/distributeFrames");

function assignEditPoints(editPoints, selectedEditPoints) {
  const { subOneFrames, subTwoFrames } = distributeFrames(editPoints)

  const mainEditPointList = selectedEditPoints.mainEditPoint
  const subOneEditPointList = selectedEditPoints.subOneEditPoint;
  const subTwoEditPointList = selectedEditPoints.subTwoEditPoint;

  mainEditPointList.forEach((frameNumber) => {
    if (subOneFrames.hasOwnProperty(frameNumber)) {
      delete subOneFrames[frameNumber];
    }

    if (subTwoFrames.hasOwnProperty(frameNumber)) {
      delete subTwoFrames[frameNumber];
    }
  });

  subOneEditPointList.forEach((frameNumber) => {
    if (!subOneFrames.hasOwnProperty(frameNumber)) {
      subOneFrames[frameNumber] = 2;
    }

    if (subTwoFrames.hasOwnProperty(frameNumber)) {
      delete subTwoFrames[frameNumber];
    }
  });

  subTwoEditPointList.forEach((frameNumber) => {
    if (!subTwoFrames.hasOwnProperty(frameNumber)) {
      subOneFrames[frameNumber] = 2;
    }

    if (subOneFrames.hasOwnProperty(frameNumber)) {
      delete subTwoFrames[frameNumber];
    }
  });

  return { subOneFrames, subTwoFrames };
}

module.exports = assignEditPoints;
