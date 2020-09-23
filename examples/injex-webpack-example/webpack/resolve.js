const shared = require("./shared");

module.exports = {
    extensions: [".js", ".ts"],

    modules: [shared.contextPath, "node_modules"]
};