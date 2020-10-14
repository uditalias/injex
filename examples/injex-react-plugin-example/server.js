const PORT = process.env.PORT || 3006;
const express = require("express");
const webpack = require("webpack");
const path = require("path");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const config = require("./webpack.config");
const compiler = webpack(config);
const app = express();
const http = require("http").createServer(app);

app
    .use(express.static(path.resolve(__dirname, "public")))
    .use(
        devMiddleware(compiler, {
            publicPath: "/",
            logLevel: "WARN",
            stats: {
                colors: true,
                performance: true
            }
        })
    )
    .use(hotMiddleware(compiler));

http.listen(PORT, () => console.log(`🌍 Server is running on http://localhost:${PORT}...`));