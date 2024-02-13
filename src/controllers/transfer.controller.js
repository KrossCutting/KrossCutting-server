/* eslint-disable */
const ytdl = require("ytdl-core");
const s3Client = require("../aws/s3Client");

const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const transferContents = require("../services/transferContents");

async function transferMedia(req, res, next) {
  try {
    const videoRequest = req.body.videoUrls;
    const videoList = Object.entries(videoRequest)
      .filter(([title, url]) => url && url.trim() !== "")
      .reduce((acc, [title, url]) => ({ ...acc, [title]: url }), {});

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
          case "mainYoutubeUrl":
            folder = "main-contents";
            break;

          case "subOneYoutubeUrl":
            folder = "sub-one-contents";
            break;

          case "subTwoYoutubeUrl":
            folder = "sub-two-contents";
            break;

          default:
            throw new Error(`Unknown title: ${title}`);
        }

        const [videoKey, audioKey] = await transferContents(
          title,
          url,
          s3Client,
          folder
        );

        const s3ClientVideoUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: videoKey,
          }),
          { expiresIn: 60000 }
        );

        const s3ClientAudioUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: audioKey,
          }),
          { expiresIn: 60000 }
        );

        return { title, s3ClientVideoUrl, s3ClientAudioUrl };
      }
    );

    const s3ClientUrlList = await Promise.allSettled(clientUrlPromiseList);
    const s3ClientVideoUrlList = s3ClientUrlList.map(
      (urlInfo) => urlInfo.value.s3ClientVideoUrl
    );
    const s3ClientAudioUrlList = s3ClientUrlList.map(
      (urlInfo) => urlInfo.value.s3ClientAudioUrl
    );

    return res.status(200).send({
      result: "success",
      message: "client urls sent successfully",
      videoUrlList: s3ClientVideoUrlList,
      audioUrlList: s3ClientAudioUrlList,
    });
  } catch (err) {
    console.error(err);

    res
      .status(500)
      .send({ message: "Error in processing videos", error: err.message });
  }
}

module.exports = transferMedia;
