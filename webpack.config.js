const path = require('path');
const outputDirectory = 'build';

module.exports = {
	entry: {
		main: './src/client/index.js'
	},
	output: {
		path: path.join(__dirname, outputDirectory),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['react', 'es2015']
						}
					}
				],
			}
		]
	},
	performance: {
		hints: false
	}
};