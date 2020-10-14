const path = require("path");
const shared = require("./shared");

module.exports = {
    path: path.resolve(__dirname, "..", shared.destinationDir),
    publicPath: shared.publicPath,
    filename: `bundle.js`,
    libraryTarget: 'umd'
};