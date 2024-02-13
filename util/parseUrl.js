function parseUrl(url) {
  const fullUrl = new URL(url);
  const key = fullUrl.pathname.substring(1);
  const bucketName = fullUrl.hostname.split(".")[0];
  const fileExtension = key.split(".").pop();

  return { key, bucketName, fileExtension };
}

module.exports = parseUrl;
