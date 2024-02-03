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

    const audioFile = ytdl.downloadFromInfo(videoInfo, {
      format: audioFormatInfo,
    });
    const videoFile = ytdl.downloadFromInfo(videoInfo, {
      format: highQualityVideo,
    });

    const videoUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET,
        Key: `${folder}/videos/${title}-original.mp4`,
        Body: videoFile,
        ContentType: "video/mp4",
      },
    });

    const audioUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET,
        Key: `${folder}/audios/${title}-original.mp3`,
        Body: audioFile,
        ContentType: "audio/mpeg",
      },
    });

    await Promise.allSettled([videoUpload.done(), audioUpload.done()]);
  } catch (err) {
    console.error(err);

    throw err;
  }
}

module.exports = getMediaResources;
