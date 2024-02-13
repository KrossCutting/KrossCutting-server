/* eslint-disable */
const fs = require("fs");
const path = require("path");
const s3Client = require("../aws/s3Client");
const { Upload } = require("@aws-sdk/lib-storage");

async function uploadToS3(filePath) {
  const { status, value } = filePath;

  if (status !== "fulfilled") {
    return;
  }

  const videoPath = value.videoPath;
  const audioPath = value.audioPath;

  const folder = path.dirname(videoPath).split("/").pop();
  const videoTitle = path.basename(videoPath);
  const audioTitle = path.basename(audioPath);
  const videoKey = `${folder}-contents/videos/${videoTitle}`;
  const audioKey = `${folder}-contents/audios/${audioTitle}`;

  const videoUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET,
      Key: videoKey,
      Body: fs.createReadStream(videoPath),
      ContentType: "video/mp4",
    }
  });
  const audioUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET,
      Key: audioKey,
      Body: fs.createReadStream(audioPath),
      ContentType: "audio/mpeg",
    }
  });

  await Promise.all([videoUpload.done(), audioUpload.done()]);

  return [videoKey, audioKey];
}

module.exports = uploadToS3;
