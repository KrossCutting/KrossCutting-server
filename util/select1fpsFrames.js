function select1fpsFrame(framePathList) {
  return framePathList.filter((_, index) => index % 30 === 0);
}

module.exports = select1fpsFrame;
