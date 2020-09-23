module.exports = {
	rules: [
		{
			test: /\.ts?$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader",
				options: {
					cacheDirectory: true,
					cacheCompression: false
				}
			}
		}
	]
};