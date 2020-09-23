const shared = require("./shared");

const entry = [
    "index.ts"
];

if (shared.dev) {
    entry.unshift("webpack-hot-middleware/client");
}

module.exports = entry;