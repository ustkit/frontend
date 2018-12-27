const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, 'src', 'index.jsx')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'resources/js/bundle.js?[hash]'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            components: path.resolve(__dirname, 'src', 'components'),
            containers: path.resolve(__dirname, 'src', 'containers'),
            actions: path.resolve(__dirname, 'src', 'actions'),
            reducers: path.resolve(__dirname, 'src', 'reducers'),
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.s?css$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=resources/fonts/[name].[ext]'
            },
            {
                test: /\.(svg|gif|jpe?g|png)$/,
                loader: 'file-loader?name=resources/images/[name].[ext]'
            }
        ]
    },
    
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    
    devServer: {
        historyApiFallback: true,
    },
    
    plugins: [
        new HtmlPlugin({
            title: 'Linker',
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: 'index.html',
            minify: {removeScriptTypeAttributes: true}
        }),
        new MiniCssExtractPlugin({filename: 'resources/css/style.css?[contenthash]'}),
        new CopyWebpackPlugin([
            {
                from: 'src/locale',
                to: 'resources/locale'
            },
            {
                from: 'src/data',
                to: 'resources/data'
            },
            {
                from: 'src/robots.txt',
                to: 'robots.txt'
            },
            {
                from: 'src/images/favicon.png',
                to: 'resources/images/favicon.png'
            }
        ]),
    ]
};
