const path = require('path');
const pkg = require('./package.json');
// const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

const libPath = path.join(__dirname, 'src');
const wwwPath = path.join(__dirname, 'www');

module.exports = {
    entry: path.join(libPath, 'index.ts'),
    output: {
        path: wwwPath,
        filename: 'app-[hash:6].js',
    },
    devServer: {
        host: '0.0.0.0',
    },
    node: {
        fs: 'empty',
    },
    module: {
        loaders: [{
                test: /\.html$/,
                loader: 'html',
            }, {
                test: /\.json$/,
                loader: 'json',
            }, {
                test: /\.(png|jpg)$/,
                loader: 'file?name=img/[name].[ext]',
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader',
            }, {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer!sass',
            }, {
                test: [/ionicons\.svg/, /ionicons\.eot/, /ionicons\.ttf/, /ionicons\.woff/],
                loader: 'file?name=fonts/[name].[ext]',
            }, {
                test: /\.js$/,
                exclude: /(node_modules|vendor|src\/lib)/,
                loader: 'babel-loader',
            },
            { test: /\.js$/, exclude: /(node_modules|vendor)/, loader: 'babel-loader' },
            //{ test: /\.css$/, loader: "style-loader!css-loader!postcss-loader" },
            { test: /\.ts$/, loader: 'babel-loader!ts-loader' }
        ],
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js'],
        root: [
            libPath,
            path.join(__dirname, 'node_modules'),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            COMPILE_ENV: process.env.COMPILE_ENV,
            ENVIRONMENT: process.env.ENVIRONMENT,
            URL_BUCKET: process.env.URL_BUCKET,
            URL_API: process.env.URL_API,
            FACEBOOK_ID: process.env.FACEBOOK_ID,
            pkg,
            hash: Math.random().toString(36).substring(4),
            CDN: './',
            template: path.join(libPath, 'index.ejs'),
        }),
        // para que no cargue todos los locales de moment
        new Webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es/),
    ],
};