/* eslint-disable */
const distributeFramesEvenly = require("./distributeFramesEvenly");
const mergeFrames = require("../util/mergeFrames");

function assignEditPoints(editPoints, selectedEditPoints, labelInfo) {
  const { subOneFrames, subTwoFrames } = distributeFramesEvenly(editPoints)

  const {mainEditPoint, subOneStartPoint, subTwoStartPoint} = labelInfo;
  const mainEditPointList = selectedEditPoints.mainEditPoint
  const subOneEditPointList = selectedEditPoints.subOneEditPoint;
  const subTwoEditPointList = selectedEditPoints.subTwoEditPoint;

  mainEditPointList.forEach((second) => {
    const frameNumber = (second - mainEditPoint) * 30;

    if (subOneFrames.hasOwnProperty(frameNumber)) {
      delete subOneFrames[frameNumber];
    }

    if (subTwoFrames.hasOwnProperty(frameNumber)) {
      delete subTwoFrames[frameNumber];
    }
  });

  subOneEditPointList.forEach((second) => {
    const frameNumber = (second - subOneStartPoint) * 30;

    if (!subOneFrames.hasOwnProperty(frameNumber)) {
      subOneFrames[frameNumber] = 2;
    }

    if (subTwoFrames.hasOwnProperty(frameNumber)) {
      delete subTwoFrames[frameNumber];
    }
  });

  subTwoEditPointList.forEach((second) => {
    const frameNumber = (second - subTwoStartPoint) * 30;

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
