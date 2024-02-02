/* eslint-disable */
const ytdl = require("ytdl-core");
const s3Client = require("../../aws/s3Client");

const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const getMediaResources = require("../../services/getMediaResources");

exports.transferMedia = async function (req, res, next) {
  try {
    const videoList = req.body.videoUrls;

    for (const url of Object.values(videoList)) {
      const infoOfVideo = await ytdl.getInfo(url);

      const hasHighQuality = infoOfVideo.formats.some(
        (format) => format.qualityLabel === "1080p"
      );
      const isProperLength =
        parseInt(infoOfVideo.videoDetails.lengthSeconds, 10) < 300;

      if (!hasHighQuality && req.body.isPermitted !== true) {
        return res.status(200).send({ result: "fail", message: "quality" });
      }

      if (!isProperLength) {
        return res.status(200).send({ result: "fail", message: "length" });
      }
    }

    const clientUrlPromiseList = Object.entries(videoList).map(
      async ([title, url]) => {
        let folder = "";

        switch (title) {
          case "mainVideo":
            folder = "main-contents";
            break;

          case "firstSubVideo":
            folder = "sub-one-contents";
            break;

          case "lastSubVideo":
            folder = "sub-two-contents";
            break;

          default:
            throw new Error(`Unknown title: ${title}`);
        }

        await getMediaResources(title, url, s3Client, folder);

        const s3ClientVideoUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: `${folder}/videos/${title}-original.mp4`,
          }),
          { expiresIn: 60000 }
        );

        const s3ClientAudioUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: `${folder}/audios/${title}-original.mp3`,
          }),
          { expiresIn: 60000 }
        );

        return { title, s3ClientVideoUrl, s3ClientAudioUrl };
      }
    );

    const s3ClientUrlList = await Promise.allSettled(clientUrlPromiseList);
    const s3ClientVideoUrlList = s3ClientUrlList.map((urlInfo) => ({
      [urlInfo.title]: urlInfo.videoUrl,
    }));
    const s3ClientAudioUrlList = s3ClientUrlList.map((urlInfo) => ({
      [urlInfo.title]: urlInfo.audioUrl,
    }));

    return res.status(200).send({
      message: "success",
      videoUrlList: s3ClientVideoUrlList,
      audioUrlList: s3ClientAudioUrlList,
    });
  } catch (err) {
    console.error(err);

    res
      .status(500)
      .send({ message: "Error in processing videos", error: err.message });
  }
};
