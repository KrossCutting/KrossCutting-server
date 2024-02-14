const path = require("path");
const { spawn } = require("child_process");

const PYTHON_SCRIPT_PATH = path.join(__dirname, "./python/findAudioStart.py");

function extractStartTime(args) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [PYTHON_SCRIPT_PATH, ...args]);

    let result = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      reject();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject();
        return;
      }
      resolve(JSON.parse(result.trim()));
    });
  });
}

module.exports = extractStartTime;
