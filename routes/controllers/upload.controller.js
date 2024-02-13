const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3Client = require("../../aws/s3Client");
const uploadToS3 = require("../../services/uploadToS3");
const saveExtractedAudios = require("../../services/saveExtractedAudios");

async function upload(req, res, next) {
  const fileInfo = req.files;
  const fileNames = Object.keys(req.files);

  try {
    const filePaths = await Promise.allSettled(
      fileNames.map(async (fileName) => {
        const file = fileInfo[fileName][0];
        const videoPath = file.path;
        const audioPath = await saveExtractedAudios(videoPath);
        return { videoPath, audioPath };
      }),
    );

    const s3ClientUrlList = await Promise.allSettled(
      filePaths.map(async (path) => {
        const [videoKey, audioKey] = await uploadToS3(path);
        const s3ClientVideoUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: videoKey,
          }),
          { expiresIn: 60000 },
        );

        const s3ClientAudioUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: audioKey,
          }),
          { expiresIn: 60000 },
        );

        return { s3ClientVideoUrl, s3ClientAudioUrl };
      }),
    );

    const s3ClientVideoUrlList = s3ClientUrlList.map(
      (urlInfo) => urlInfo.value.s3ClientVideoUrl,
    );
    const s3ClientAudioUrlList = s3ClientUrlList.map(
      (urlInfo) => urlInfo.value.s3ClientAudioUrl,
    );

    res.status(200).send({
      result: "success",
      message: "client urls send successfully",
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

module.exports = upload;
