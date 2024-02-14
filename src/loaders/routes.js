const contents = require("../routes/contents");
const compilations = require("../routes/compilations");

function connectRouters(app) {
  app.use("/videos/contents", contents);
  app.use("/videos/compilations", compilations);
}

module.exports = connectRouters;
