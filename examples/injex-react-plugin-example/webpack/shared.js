const path = require("path");
const dev = process.env.NODE_ENV !== "production";
const destinationDir = "./umd";
const contextPath = path.join(__dirname, "../src");
const version = require("../package.json").version;

module.exports = {
    version,
    dev,
    destinationDir,
    contextPath,
};