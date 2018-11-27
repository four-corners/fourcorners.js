const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;
const pkg = require('./package.json');
const autoprefixer = require('autoprefixer');
const svgo = require('svgo-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let mode, devtool, outputJS, outputCSS;
let fileName = pkg.name;
const libraryName = 'FourCorners'

if (env === 'build') {
	mode = 'production';
	devtool = 'source-map';
	outputJS = fileName + '.min.js';
	outputCSS = 'four-corners.min.css';
} else {
	mode = 'development';
	outputJS = fileName + '.js';
	outputCSS = 'four-corners.css';
}

const config = {
	mode: mode,
	// entry: [__dirname + '/index.js', __dirname + '/src/styles.scss'],
	entry: [__dirname + '/index.js'],
	devtool: devtool,
	output: {
		path: __dirname + '/dist',
		filename: outputJS,
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /(\.jsx|\.js)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			},
			{
				test: /(\.scss|\.sass)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.svg/,
				use: [
					{
						loader: 'svg-url-loader'
					}
					// {
					// 	loader: 'file-loader',
					// },
					// {
					// 	loader: 'svg-inline-loader'
					// },
					// {
					// 	loader: 'svgo-loader',
					// 	options: {
					// 		plugins: [
					// 			{removeTitle: true},
					// 			{convertColors: {shorthex: false}},
					// 			{convertPathData: true}
					// 		]
					// 	}
					// }
				]
			}
		]
	},
	resolve: {
		modules: [path.resolve('./node_modules'), path.resolve('./src')],
		extensions: ['.json', '.js']
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: outputCSS,
			chunkFilename: '[id].css'
		})
	],
	optimization: {
		minimizer: [
			new OptimizeCSSAssetsPlugin({}),
			new UglifyJsPlugin()
		]
	}
};

module.exports = config;