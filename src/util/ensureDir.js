const fs = require("fs").promises;

async function ensureDir(fileDirectory) {
  try {
    await fs.access(fileDirectory);
  } catch (err) {
    await fs.mkdir(fileDirectory, { recursive: true });
  }
}

module.exports = ensureDir;
