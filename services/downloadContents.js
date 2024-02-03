/* eslint-disable  */
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const { S3_DIR } = require("../constants/paths");
const s3Client = require("../aws/s3Client");

function downloadVideo(url, role) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(url);
    const key = fullUrl.pathname.substring(1);
    const bucketName = fullUrl.hostname.split(".")[0];
    const videoExtension = key.split('.').pop().toLowerCase();
    const videoTitle = role.toLowerCase();

    const videoInfo = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const videoWebmDir = path.join(S3_DIR.VIDEOS[role], `${videoTitle}-original.webm`);
    const videoMp4Dir = path.join(S3_DIR.VIDEOS[role], `${videoTitle}-original.mp4`);
    const videoDir = videoExtension === "mp4" ? videoMp4Dir : videoWebmDir;
    const ffmpegCommand = `ffmpeg -i "${videoMp4Dir}" -c:v libx264 -preset slow -crf 22 "${videoWebmDir}"`;

    fs.mkdirSync(S3_DIR.VIDEOS[role], { recursive: true });

    s3Client.send(videoInfo)
      .then((data) => {
        const fileStream = fs.createWriteStream(videoDir);

        data.Body.pipe(fileStream);
        data.Body.on("end", () => {
          if (videoExtension === "mp4") {
            exec(ffmpegCommand, (error, stdout, stderr) => {
              if (error) {
                reject(error);
                return;
              }

              resolve();
            })
          } else {
            resolve();
          }
        });
      })
      .catch((error) => reject(error));
  });
}

function downloadAudio(url, role) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(url);
    const key = fullUrl.pathname.substring(1);
    const bucketName = fullUrl.hostname.split(".")[0];
    const audioExtension = key.split('.').pop().toLowerCase();
    const audioTitle = role.toLowerCase();

    const audioInfo = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const audioWebmDir = path.join(S3_DIR.AUDIOS[role], `${audioTitle}-original.webm`);
    const audioMp4Dir = path.join(S3_DIR.AUDIOS[role], `${audioTitle}-original.mp3`);
    const audioDir = audioExtension === "mp3" ? audioMp4Dir : audioWebmDir;
    const ffmpegCommand = `ffmpeg -i "${audioWebmDir}" -c:v libx264 -preset slow -crf 22 "${audioMp4Dir}"`;

    fs.mkdirSync(S3_DIR.AUDIOS[role], { recursive: true });

    s3Client.send(audioInfo)
      .then((data) => {
        const fileStream = fs.createWriteStream(audioDir);
        data.Body.pipe(fileStream);
        data.Body.on("end", () => {
          if (audioExtension === "webm") {
            exec(ffmpegCommand, (error, stdout, stderr) => {
              if (error) {
                reject(error);
                return;
              }

              resolve();
            })
          } else {
            resolve();
          }
        });
      })
      .catch((error) => reject(error));
  });
}

 exports.downloadAllVideos = async (urls) => {
  for (const role in urls) {
    switch(role) {
      case "mainVideoUrl":
        await downloadVideo(urls[role], "MAIN");
        break;

      case "firstSubVideoUrl":
        await downloadVideo(urls[role], "SUB_ONE");
        break;

      case "lastSubVideoUrl":
        await downloadVideo(urls[role], "SUB_TWO");
        break;

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}

exports.downloadAllAudios = async (urls) => {
  for (const role in urls) {
    switch(role) {
      case "mainAudioUrl":
        downloadAudio(urls[role], "MAIN");
        break;

      case "firstSubAudioUrl":
        downloadAudio(urls[role], "SUB_ONE");
        break;

      case "lastSubAudioUrl":
        downloadAudio(urls[role], "SUB_TWO");
        break;

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}
