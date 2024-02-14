/* eslint-disable  */
const fs = require("fs");
const path = require("path");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = require("../aws/s3Client");
const parseUrl = require("../util/parseIrl");
const { TEMP_DIR_VIDEOS, TEMP_DIR_AUDIOS } = require("../constants/paths");
const { convertVideoFormat, convertAudioFormat } = require("./convertFileFormat");

function downloadVideo(url, role) {
  return new Promise((resolve, reject) => {
    const { key, bucketName, fileExtension } = parseUrl(url);
    const videoTitle = role.toLowerCase();

    const videoInfo = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const videoMp4Path = path.join(TEMP_DIR_VIDEOS[role], `${videoTitle}-original.mp4`);
    const videoWebmPath = path.join(TEMP_DIR_VIDEOS[role], `${videoTitle}-original.webm`);
    const videoPath = fileExtension === "mp4" ? videoMp4Path : videoWebmPath;

    fs.mkdirSync(TEMP_DIR_VIDEOS[role], { recursive: true });

    s3Client.send(videoInfo)
      .then((data) => {
        const videoStream = fs.createWriteStream(videoPath);

        data.Body.pipe(videoStream);
        data.Body.on("end", async () => {
          if (fileExtension === "webm") {
            await convertVideoFormat(videoWebmPath, videoMp4Path);
            resolve();
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
    const { key, bucketName, fileExtension } = parseUrl(url);
    const audioTitle = role.toLowerCase();

    const audioInfo = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const audioMp3Path = path.join(TEMP_DIR_AUDIOS[role], `${audioTitle}-original.mp3`);
    const audioWebmPath = path.join(TEMP_DIR_AUDIOS[role], `${audioTitle}-original.webm`);
    const audioPath = fileExtension === "mp3" ? audioMp3Path : audioWebmPath;

    fs.mkdirSync(TEMP_DIR_AUDIOS[role], { recursive: true });

    s3Client.send(audioInfo)
      .then((data) => {
        const audioStream = fs.createWriteStream(audioPath);

        data.Body.pipe(audioStream);
        data.Body.on("end", async () => {
          if (fileExtension === "webm") {
            await convertAudioFormat(audioWebmPath, audioMp3Path)
            resolve();
          } else {
            resolve();
          }
        });
      })
      .catch((error) => reject(error));
  });
}

 async function downloadAllVideos(urls) {
  const urlList = Object.keys(urls);

  for (const role of urlList) {
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

async function downloadAllAudios(urls) {
  const urlList = Object.keys(urls);

  for (const role of urlList) {
    switch(role) {
      case "mainAudioUrl":
        await downloadAudio(urls[role], "MAIN");
        break;

      case "firstSubAudioUrl":
        await downloadAudio(urls[role], "SUB_ONE");
        break;

      case "lastSubAudioUrl":
        await downloadAudio(urls[role], "SUB_TWO");
        break;

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}

module.exports = { downloadAllVideos, downloadAllAudios };
