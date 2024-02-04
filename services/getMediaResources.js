const ytdl = require("ytdl-core");
const { Upload } = require("@aws-sdk/lib-storage");

async function getMediaResources(title, url, s3Client, folder) {
  try {
    const videoInfo = await ytdl.getInfo(url);

    const highQualityVideo =
      videoInfo.formats.find((format) => format.qualityLabel === "1080p") ||
      videoInfo.formats.find((format) => format.qualityLabel === "720p");

    if (!highQualityVideo) {
      throw new Error("lowQualityVideo");
    }

    const audioFormatInfo = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    const videoFile = ytdl.downloadFromInfo(videoInfo, {
      format: highQualityVideo,
    });
    const audioFile = ytdl.downloadFromInfo(videoInfo, {
      format: audioFormatInfo,
    });

    const videoContentType =
      highQualityVideo.container === "mp4" ? "video/mp4" : "video/webm";
    const audioContentType =
      audioFormatInfo.container === "mp3" ? "audio/mpeg" : "audio/webm";

    const videoKey =
      highQualityVideo.container === "mp4"
        ? `${folder}/videos/${title}-original.mp4`
        : `${folder}/videos/${title}-original.webm`;
    const audioKey =
      audioFormatInfo.container === "mp3"
        ? `${folder}/audios/${title}-original.mp3`
        : `${folder}/audios/${title}-original.webm`;

    const videoUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET,
        Key: videoKey,
        Body: videoFile,
        ContentType: videoContentType,
      },
    });
    const audioUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET,
        Key: audioKey,
        Body: audioFile,
        ContentType: audioContentType,
      },
    });

    await Promise.allSettled([videoUpload.done(), audioUpload.done()]);
  } catch (err) {
    console.error(err);

    throw err;
  }
}

module.exports = getMediaResources;
