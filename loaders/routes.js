const videos = require("../routes/videos");

module.exports = function connectRouters(app) {
  app.use("/videos", videos);
};
