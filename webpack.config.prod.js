const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = require('./webpack.config.js');
const util = require('util');

const libPath = path.join(__dirname, 'src');

const CDN = './';

module.exports = util._extend(webpackConfig, {
    debug: false,
    stats: {
        colors: true,
        progress: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            minify: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true,
            },
            hash: Math.random().toString(36).substring(4),
            COMPILE_ENV: process.env.COMPILE_ENV,
            ENVIRONMENT: process.env.ENVIRONMENT,
            URL_BUCKET: process.env.URL_BUCKET,
            URL_API: process.env.URL_API,
            FACEBOOK_ID: process.env.FACEBOOK_ID,
            CDN,
            pkg,
            template: path.join(libPath, 'index.ejs'),
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false, // prod
            // beautify: false, //prod
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es/),
    ],
});