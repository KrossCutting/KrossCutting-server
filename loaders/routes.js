const contents = require("../routes/contents");
const compilations = require("../routes/compilations");

module.exports = function connectRouters(app) {
  app.use("/videos", contents);
  app.use("/videos", compilations);
};
