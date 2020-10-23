const webpack = require("webpack");
const shared = require("./shared");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ForkTsCheckerWebpackPluginConfig = new ForkTsCheckerWebpackPlugin({
    eslint: {
        files: '../src/**/*.{ts,tsx}'
    },
    typescript: {
        configFile: "../tsconfig.json"
    }
});

const IndexHTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: "./views/index.handlebars",
    filename: "index.html",
    inject: "body"
});

const DefinePluginConfig = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.VERSION": JSON.stringify(shared.version),
    "__DEV__": shared.dev,
});

const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
    filename: `bundle.css`
});

const HotModuleReplacementPluginConfig = new webpack.HotModuleReplacementPlugin();

const plugins = [
    HotModuleReplacementPluginConfig,
    ForkTsCheckerWebpackPluginConfig,
    MiniCssExtractPluginConfig,
    DefinePluginConfig,
    IndexHTMLWebpackPluginConfig,
];

module.exports = plugins;
