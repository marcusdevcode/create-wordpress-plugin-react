const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config');
module.exports = {
	...defaults,
	entry: './src/index.tsx',
	module: {
		rules: [
			...defaults.module.rules,
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
};
