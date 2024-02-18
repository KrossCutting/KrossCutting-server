const contents = require("../routes/contents");
const validations = require("../routes/validations");
const compilations = require("../routes/compilations");

function connectRouters(app) {
  app.use("/videos/contents", contents);
  app.use("/videos/compilations", compilations);
  app.use("/validations", validations);
}

module.exports = connectRouters;
