const detectSingleShots = require("../services/detectSingleShots");

describe("Detect SingleShots", () => {
  it("움직임 비율과 얼굴 예측 임계값이 만족될 경우 편집지점 목록에 프레임을 추가해야 합니다", () => {
    const movementRatioList = [{ path: "frame_30.jpg", movementRatio: 0.2 }];
    const facePredictionList = [
      {
        framePath: "frame_30.jpg",
        predictions: [{ probability: 0.96 }],
      },
    ];

    const results = detectSingleShots(facePredictionList, movementRatioList);
    expect(results).toContain("frame_30.jpg");
  });

  it("움직임 비율이 평균 임계값 미만일 경우 해당 프레임을 편집지점 목록에 추가하지 않아야 합니다", () => {
    const movementRatioList = [
      { path: "frame_30.jpg", movementRatio: 0.05 },
      { path: "frame_60.jpg", movementRatio: 0.01 },
    ];
    const facePredictionList = [
      { framePath: "frame_30.jpg", predictions: [{ probability: 0.96 }] },
      { framePath: "frame_60.jpg", predictions: [{ probability: 0.99 }] },
    ];

    const results = detectSingleShots(facePredictionList, movementRatioList);
    expect(results).not.toContain("frame_30.jpg");
    expect(results).not.toContain("frame_60.jpg");
  });

  it("움직임 비율이 평균 값을 넘고 매우 높은 확률로 얼굴이 감지되었을 경우 프레임을 편집지점에 추가해야 합니다", () => {
    const movementRatioList = [{ path: "frame_30.jpg", movementRatio: 0.1 }];
    const facePredictionList = [
      {
        framePath: "frame_30.jpg",
        predictions: [{ probability: 0.96 }],
      },
    ];

    const results = detectSingleShots(facePredictionList, movementRatioList);
    expect(results).toContain("frame_30.jpg");
  });

  it("얼굴이 감지되지 않았을 경우 프레임을 편집지점 목록에 추가하지 않아야 합니다", () => {
    const movementRatioList = [{ path: "frame_30.jpg", movementRatio: 0.2 }];
    const facePredictionList = [{ framePath: "frame_30.jpg", predictions: [] }];

    const results = detectSingleShots(facePredictionList, movementRatioList);
    expect(results).not.toContain("frame_30.jpg");
  });
});
