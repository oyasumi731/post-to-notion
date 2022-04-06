const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TailwindCSS = require('tailwindcss');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');

const distPath = path.resolve(__dirname, 'dist/');
const appPath = path.resolve(__dirname, 'app/');

module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        popup: path.resolve(appPath, "src/Popup.tsx"),
        // options: path.resolve(appPath, "src/Options.tsx"),
        background: path.resolve(appPath, "src/background.tsx"),
    },
    output: {
        path: distPath,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    TailwindCSS
                                ]
                            }
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "./*.html", to: distPath, context: path.resolve(appPath, "static/") },
                { from: "manifest.json", to: distPath, context: appPath }
            ]
        }),
        new MiniCssExtractPlugin({ filename: './styles/[name].css' }),
        new Dotenv({ systemvars: true }),
    ],
    devtool: "inline-source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devServer: {
        static: {
            directory: distPath,
        },
        hot: true, // ホットリロードを有効化する
        devMiddleware: {
            writeToDisk: true
        },
        client: false,
    },
};