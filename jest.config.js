module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["./src/**/*.js"],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/middlewares/adjustAudio.js",
    "/src/middlewares/extractFrames.js",
    "/src/services/detectFace.js",
    "/src/services/exportFinalVideo.js",
    "/src/services/extractFramesFromVideo.js",
    "/src/services/extractStartTime.js",
    "/src/services/editFrames.js",
    "/src/services/python/*.py",
  ],
};
