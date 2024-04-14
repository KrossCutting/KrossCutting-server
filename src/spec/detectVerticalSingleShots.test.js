const { exp } = require("@tensorflow/tfjs-node");
const detectVerticalSingleShots = require("../services/detectVerticalSingleShots");

describe("Detect Vertical SingleShots", () => {
  it("움직임 비율의 임계점을 추출하고, 해당하는 편집지점을 정확히 추출해야 합니다.", () => {
    const movementRatioList = [
      { path: "frame_30.jpg", movementRatio: 0.1 },
      { path: "frame_60.jpg", movementRatio: 0.6 },
      { path: "frame_90.jpg", movementRatio: 0.1 },
      { path: "frame_120.jpg", movementRatio: 0.7 },
    ];
    const [selectedFrames, NonSelectedAvg] =
      detectVerticalSingleShots(movementRatioList);

    expect(selectedFrames).toEqual(["frame_60.jpg", "frame_120.jpg"]);
    expect(NonSelectedAvg).toBeCloseTo(0.1);
  });
});
