const sharp = require("sharp");
const analyzeMovementRatio = require("../services/analyzeMovementRatio");

jest.mock("sharp");

describe("Analyze movement ratio", () => {
  beforeEach(() => {
    sharp.mockClear();
  });

  it("should correctly calculate the black pixel ratio", async () => {
    const mockData = Buffer.from([10, 10, 10, 255, 255, 255]);
    const mockInfo = { width: 1, height: 2, channels: 3 };

    sharp.mockImplementation(() => ({
      raw: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue({ data: mockData, info: mockInfo }),
    }));

    const blackRatio = await analyzeMovementRatio("mockPath");
    expect(blackRatio).toBe(0.5);
  });

  it("should detect black pixels based on threshold", async () => {
    const mockData = Buffer.from([10, 10, 10, 12, 12, 12]);
    const mockInfo = { width: 1, height: 2, channels: 3 };

    sharp.mockImplementation(() => ({
      raw: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue({ data: mockData, info: mockInfo }),
    }));

    const blackRatio = await analyzeMovementRatio("mockPath");
    expect(blackRatio).toBe(0.5);
  });
});
