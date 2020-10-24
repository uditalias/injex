const TerserPlugin = require("terser-webpack-plugin");

const TerserPluginConfig = new TerserPlugin({
    parallel: true,
    extractComments: false,
    terserOptions: {
        ecma: 6,
        keep_classnames: true,
        output: {
            comments: false
        }
    }
});

module.exports = {
    noEmitOnErrors: true,
    minimizer: [
        TerserPluginConfig
    ]
};