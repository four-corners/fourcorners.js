const path = require('path');
const argv = require('yargs').argv;
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let mode, devtool, outputJS, outputCSS;
const fileName = 'fourcorners';

if (argv.mode === 'production') {
	mode = 'production'
	devtool: 'inline-source-map',
	outputJS = `${fileName}.min.js`;
	outputCSS = `${fileName}.min.css`;
} else {
	mode = 'development'
	devtool: 'inline-source-map',
	outputJS = `${fileName}.js`;
	outputCSS = `${fileName}.css`;
}

const config = {
	mode: mode,
	entry: path.resolve(__dirname, 'src/index.js'),
	devtool: devtool,
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: outputJS,
		library: {
			type: 'umd',
			name: 'FourCorners',
			export: 'default',
		}
	},
	module: {
		rules: [
			{
				resourceQuery: /file/,
				type: 'asset/resource',
			},
			{
				test: /(\.js)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: ['@babel/preset-env'],
				},
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.svg$/,
				type: 'asset',
				use: 'svgo-loader',
			},
		]
	},
	resolve: {
		modules: [path.resolve('./node_modules'), path.resolve('./src')],
		extensions: ['.js', '.json']
	},
	plugins: [
		new ESLintPlugin({
			extensions: ['js', 'jsx', 'ts'],
			exclude: ['node_modules'],
		}),
		new MiniCssExtractPlugin({
			filename: outputCSS,
			chunkFilename: '[id].css'
		}),
		// new HtmlWebpackPlugin({
		// 	title: '',
		// 	favicon: '',
		// 	filename: 'test/index.html',
		// 	template: './test/index.html',
		// }),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'test', to: 'test' },
			]
		})
	],
	optimization: {
	minimize: argv.mode === 'production',
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				terserOptions: {
					module: true,
				}
			}),
		]
	},
	devServer: {
		port: 9000,
		compress: true,
		static: {
			directory: path.join(__dirname, 'dist/test'),
		},
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		}
	},
	experiments: {
		// asyncWebAssembly: true
	}
};

module.exports = config;