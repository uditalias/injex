const webpack = require("webpack");
const shared = require("./shared");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const ForkTsCheckerWebpackPluginConfig = new ForkTsCheckerWebpackPlugin({
    tsconfig: "../tsconfig.json",
    compilerOptions: {
        outDir: "",
        declaration: false
    }
});

const DefinePluginConfig = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.VERSION": JSON.stringify(shared.version),
    "__DEV__": shared.dev,
});

const plugins = [
    ForkTsCheckerWebpackPluginConfig,
    DefinePluginConfig,
];

plugins.unshift(new webpack.HotModuleReplacementPlugin());

module.exports = plugins;
