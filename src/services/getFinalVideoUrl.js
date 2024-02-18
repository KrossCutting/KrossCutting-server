const fs = require("fs");
const path = require("path");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { TEMP_DIR_VIDEOS } = require("../constants/paths");
const s3Client = require("../aws/s3Client");

async function getFinalVideoUrl() {
  const finalVideoKey = "final-video.mp4";
  const finalVidePath = path.join(TEMP_DIR_VIDEOS.FOLDER, finalVideoKey);

  const finalVideoUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET,
      Key: finalVideoKey,
      Body: fs.createReadStream(finalVidePath),
    },
  });

  await finalVideoUpload.done();

  const s3ClientFinalVideoUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: finalVideoKey,
    }),
    { expiresIn: 30000 },
  );

  return s3ClientFinalVideoUrl;
}

module.exports = getFinalVideoUrl;
