/* eslint-disable */
const distributeFramesEvenly = require("./distributeFramesEvenly");
const mergeFrames = require("../util/mergeFrames");

function assignEditPoints(editPoints, selectedEditPoints) {
  const { subOneFrames, subTwoFrames } = distributeFramesEvenly(editPoints)

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

  const subOneMergedFrames = mergeFrames(subOneFrames);
  const subTwoMergedFrames = mergeFrames(subTwoFrames);

  return { subOneMergedFrames, subTwoMergedFrames };
}

module.exports = assignEditPoints;
