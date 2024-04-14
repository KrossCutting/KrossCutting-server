jest.mock("fs", () => ({
  promises: {
    readdir: jest.fn().mockResolvedValue(["frame_30.jpg", "frame_60.jpg"]),
  },
}));
jest.mock("../constants/paths", () => ({
  TEMP_DIR_FRAMES: {
    MAIN: "/mocked/path",
  },
}));
jest.mock("../util/select1fpsFrames", () =>
  jest
    .fn()
    .mockReturnValue([
      "frame_30.jpg",
      "frame_60.jpg",
      "frame_90.jpg",
      "frame_90.jpg",
      "frame_120.jpg",
      "frame_150.jpg",
    ]),
);

const fs = require("fs");
const analyzeVerticalDuration = require("../services/analyzeVerticalDuration");

describe("Analyze VerticalDuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("프레임의 경로를 정확하게 가져와야 합니다", async () => {
    const directory = "/mocked/path";
    await analyzeVerticalDuration([], [], 0);

    expect(fs.promises.readdir).toHaveBeenCalledWith(directory);
  });

  it("지속시간을 정확하게 계산헤야 합니다.", async () => {
    const singleShotFrameList = ["frame_30.jpg", "frame_120.jpg"];
    const movementResults = [
      { movementRatio: 0.1 },
      { movementRatio: 0.1 },
      { movementRatio: 0.1 },
      { movementRatio: 0.1 },
    ];
    const nonSelectedFramesMovementAvg = 0.09;
    const results = await analyzeVerticalDuration(
      singleShotFrameList,
      movementResults,
      nonSelectedFramesMovementAvg,
    );

    expect(results).toEqual({
      "frame_30.jpg": 4,
    });
  });
});
