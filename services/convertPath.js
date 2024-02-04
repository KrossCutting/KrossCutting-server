function convertPath(key) {
  switch (key) {
    case "mainVideoUrl":
    case "mainAudioUrl":
      return "main-contents";

    case "firstSubVideoUrl":
    case "firstSubAudioUrl":
      return "sub-one-contents";

    case "lastSubVideoUrl":
    case "lastSubAudioUrl":
      return "sub-two-contents";

    default:
      return null;
  }
}

module.exports = convertPath;
