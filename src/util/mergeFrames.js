/* eslint-disable no-continue */
function mergeFrames(frames) {
  const mergedFrames = [];
  const consecutiveFrames = [];
  const frameInfo = Object.entries(frames);

  for (let i = 0; i < frameInfo.length; i += 1) {
    const currentFrame = Number(frameInfo[i][0]);
    let currentDuration = frameInfo[i][1];

    if (consecutiveFrames.includes(currentFrame)) {
      continue;
    }

    for (let j = i + 1; j < frameInfo.length; j += 1) {
      const difference = currentDuration * 30;
      const nextFrame = Number(frameInfo[j][0]);
      const nextDuration = frameInfo[j][1];

      if (currentFrame + difference === nextFrame) {
        currentDuration += nextDuration;

        consecutiveFrames.push(nextFrame);
      }
    }

    mergedFrames.push([currentFrame, currentDuration]);
  }

  return Object.fromEntries(mergedFrames);
}

module.exports = mergeFrames;
