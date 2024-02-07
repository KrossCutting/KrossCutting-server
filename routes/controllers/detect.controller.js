const detectFaceArea = require("../../services/detectFaceArea");
const detectSingleShot = require("../../services/detectSingleShot");

exports.getSingleShotFrames = async function (req, res, next) {
  // TODO. detect관련 서비스들이 실행됩니다.
  // 컨트롤러로 위치하였으나 추후 로직 연결에 따라 변경될 수 있습니다.

  const folderName = req.contentTitle;
  // 메인인지, 서브1, 2인지에 따라 폴더명을 설정하여 전달해야합니다.

  const detectedFaceList = await detectFaceArea(folderName);
  const detectedFaceFrameNumberList = detectedFaceList.map((frame) => {
    return parseInt(frame.split("_").pop(), 10);
  });

  const detectedSingleShotList = await detectSingleShot(folderName);
  const detectedSingleShotNumberList = detectedSingleShotList.map((frame) => {
    return parseInt(frame.split("_").pop(), 10);
  });

  const filteredSingleShotNumberList = detectedSingleShotNumberList.filter(
    (number) => {
      return detectedFaceFrameNumberList.includes(number);
    },
  );

  return filteredSingleShotNumberList;
};
