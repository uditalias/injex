const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


const TerserPluginConfig = new TerserPlugin({
    parallel: true,
    extractComments: false,
    terserOptions: {
        ecma: 6,
        output: {
            comments: false
        }
    }
});

const OptimizeCSSAssetsPluginConfig = new OptimizeCSSAssetsPlugin({});

module.exports = {
    noEmitOnErrors: true,
    minimizer: [
        TerserPluginConfig,
        OptimizeCSSAssetsPluginConfig
    ],
    splitChunks: {
        cacheGroups: {
            styles: {
                name: "styles",
                test: /\.css$/,
                chunks: "all",
                enforce: true
            },
            vendors: {
                name: "vendors",
                test: /[\\/]node_modules[\\/]/,
                chunks: "all",
                priority: 1
            }
        }
    }
};