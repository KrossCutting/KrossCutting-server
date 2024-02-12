const fs = require("fs").promises;
const sharp = require("sharp");

async function dissolveFrames(previousFramePath, currentFramePath) {
  const dissolvedBuffer = await sharp(previousFramePath)
    .modulate({ saturation: 0.8 })
    .modulate({ brightness: 0.9 })
    .composite([
      {
        input: currentFramePath,
        blend: "overlay",
        opacity: 0.5,
      },
    ])
    .toBuffer();

  await fs.writeFile(currentFramePath, dissolvedBuffer);

  return currentFramePath;
}

module.exports = dissolveFrames;
