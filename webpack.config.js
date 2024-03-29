const path = require("path");
const argv = require("yargs").argv;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

let mode, devtool, outputJS, outputCSS;
const fileName = "fourcorners";

if (argv.mode === "production") {
	outputJS = `${fileName}.min.js`;
	outputCSS = `${fileName}.min.css`;
} else {
	outputJS = `${fileName}.js`;
	outputCSS = `${fileName}.css`;
}

const config = {
	mode: argv.mode,
	entry: path.resolve(__dirname, "src/index.js"),
	devtool: devtool,
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: outputJS,
		library: {
			type: "umd",
			name: "FourCorners",
			export: "default",
		}
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				loader: "babel-loader",
				exclude: /node_modules/,
			},
			{
        resourceQuery: /file/,
        type: 'asset/resource',
      },
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.svg$/,
				type: "asset",
       	use: "svgo-loader",
			},
		]
	},
	resolve: {
		modules: [path.resolve("./node_modules"), path.resolve("./src")],
		extensions: [".json", ".js"]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: outputCSS,
			chunkFilename: '[id].css'
		}),
		new ESLintPlugin({
			extensions: ["js", "jsx", "ts"],
			exclude: ["node_modules"],
		})
	],
	optimization: {
    minimize: argv.mode === "production",
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				terserOptions: {
					module: true,
				}
			}),
		]
	},
};

module.exports = config;