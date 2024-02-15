const fs = require("fs").promises;
const sharp = require("sharp");

async function applyDissolve(previousFramePath, currentFramePath) {
  const dissolvedBuffer = await sharp(previousFramePath)
    .modulate({ brightness: 0.9 })
    .composite([
      {
        input: currentFramePath,
        blend: "overlay",
        opacity: 0.7,
      },
    ])
    .toBuffer();

  await fs.writeFile(currentFramePath, dissolvedBuffer);
}

module.exports = applyDissolve;
