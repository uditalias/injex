const shared = require("./shared");

module.exports = shared.dev ? "source-map" : false;
