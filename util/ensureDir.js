const fs = require("fs");

function ensureDir(fileDirectory) {
  try {
    fs.accessSync(fileDirectory);
  } catch (err) {
    fs.mkdirSync(fileDirectory, { recursive: true });
  }
}

module.exports = ensureDir;
