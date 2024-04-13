const sharp = require("sharp");

const mockAnalyzeMovementRatio = jest.fn();

jest.mock("../util/ensureDir", () => jest.fn(() => Promise.resolve()));
jest.mock("../services/analyzeMovementRatio", () =>
  jest.fn(() => Promise.resolve(0.5)),
);
jest.mock("sharp", () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    modulate: jest.fn().mockReturnThis(),
    composite: jest.fn().mockReturnThis(),
    toColourspace: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockReturnThis(),
    raw: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(),
    extract: jest.fn().mockReturnThis(),
  }));
});

const detectMovement = require("../services/detectMovement");
const mockEnsureDir = require("../util/ensureDir");

describe("Detect Movement", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    sharp.mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      modulate: jest.fn().mockReturnThis(),
      composite: jest.fn().mockReturnThis(),
      toColourspace: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue({
        data: Buffer.from([1, 2, 3]),
        info: { width: 250, height: 250, channels: 3 },
      }),
      raw: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockResolvedValue(),
      extract: jest.fn().mockReturnThis(),
    }));
  });

  it("Frame 디렉토리가 없을 경우 디렉토리를 생성해야 합니다.", async () => {
    const filteredFramePathList = ["frame_30.jpg", "frame_60.jpg"];

    await detectMovement(filteredFramePathList, "mockFolder");

    mockEnsureDir();

    expect(mockEnsureDir).toHaveBeenCalledWith(expect.any(String));
  });

  it("이미지의 색상처리(채도/명도)가 올바르게 적용되어야 합니다", async () => {
    const filteredFramePathList = ["frame_30.jpg", "frame_60.jpg"];

    await detectMovement(filteredFramePathList, "mockFolder");

    expect(sharp).toHaveBeenCalled();

    const mockSharpInstance = sharp.mock.results[0].value;

    expect(mockSharpInstance.resize).toHaveBeenCalledWith(250, 250);
    expect(mockSharpInstance.modulate).toHaveBeenNthCalledWith(1, {
      saturation: 0.1,
    });

    expect(mockSharpInstance.modulate).toHaveBeenNthCalledWith(2, {
      brightness: 1.9,
    });

    expect(mockSharpInstance.modulate).toHaveBeenNthCalledWith(3, {
      saturation: 3,
    });
  });

  it("이동이 감지되면 적절한 결과를 반환해야 합니다.", async () => {
    mockAnalyzeMovementRatio.mockResolvedValue(0.5);

    const filteredFramePathList = ["frame_30.jpg", "frame_60.jpg"];
    const results = await detectMovement(filteredFramePathList, "mockFolder");

    expect(results.length).toBe(1);
    expect(results[0]).toEqual({
      path: "frame_30.jpg",
      movementRatio: 0.5,
    });
  });
});
