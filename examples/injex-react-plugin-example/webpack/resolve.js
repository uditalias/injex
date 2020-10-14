const shared = require("./shared");
const path = require("path");

module.exports = {
    extensions: [".js", ".ts", ".tsx"],

    modules: [shared.contextPath, "node_modules"],

    alias: {
        react: path.resolve("./node_modules/react")
    }
};