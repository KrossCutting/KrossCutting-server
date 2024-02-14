const fs = require("fs");

function removeDir(path) {
  fs.rmSync(path, { recursive: true }, (err) => {
    if (err) {
      console.error("Error removing folder:", err);
    }
  });
}

module.exports = removeDir;
