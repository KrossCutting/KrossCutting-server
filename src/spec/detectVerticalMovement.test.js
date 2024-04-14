const sharp = require("sharp");

const mockAnalyzeMovementRatio = jest.fn();

// jest.mock("../util/ensureDir", () => jest.fn(() => Promise.resolve()));
jest.mock("../util/ensureDir", () => jest.fn().mockResolvedValue());
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
const detectVerticalMovement = require("../services/detectVerticalMovement");

describe("Detect VerticalMovement", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    sharp.mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      modulate: jest.fn().mockReturnThis(),
      composite: jest.fn().mockReturnThis(),
      toColourspace: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue({
        data: Buffer.from([1, 2, 3]),
        info: { width: 300, height: 750, channels: 3 },
      }),
      raw: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockResolvedValue(),
      extract: jest.fn().mockReturnThis(),
    }));
  });

  it("이미지의 색상처리(채도/명도)가 올바르게 적용되어야 합니다", async () => {
    const filteredFramePathList = ["frame_30.jpg", "frame_60.jpg"];

    await detectVerticalMovement(filteredFramePathList, "mockFolder");

    expect(sharp).toHaveBeenCalled();

    const mockSharpInstance = sharp.mock.results[0].value;

    expect(mockSharpInstance.modulate).toHaveBeenNthCalledWith(1, {
      saturation: 0.1,
    });

    expect(mockSharpInstance.modulate).toHaveBeenNthCalledWith(2, {
      brightness: 2,
    });

    expect(mockSharpInstance.modulate).toHaveBeenNthCalledWith(3, {
      saturation: 3,
    });
  });
});
