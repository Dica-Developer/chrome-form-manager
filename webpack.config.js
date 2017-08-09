const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');
const SRC = path.resolve(__dirname, 'src');
const DIST = path.resolve(__dirname, 'dist');
const IS_DIST = process.env.NODE_ENV === "production";

const extractLess = new ExtractTextPlugin({
    filename: '[name].css'
});

function getConf() {
    let config = {
        entry: {
            content: path.resolve(SRC, 'content', 'index.js'),
            popup: path.resolve(SRC, 'popup', 'index.js')
        },
        output: {
            path: DIST,
            filename: '[name].js'
        },
        devtool: IS_DIST ? 'hidden-source-map' : 'cheap-source-map',
        watch: !IS_DIST,
        watchOptions: {
            ignored: /node_modules/
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.less/,
                    exclude: /node_modules/,
                    use: extractLess.extract({
                        use: [{
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                plugins: [ new CleanCSSPlugin() ]
                            }
                        }]
                    })
                }
            ]
        },
        plugins: [extractLess]
    };

    if (IS_DIST) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: false,
                }
              }),
        )
    }

    return config;
}

module.exports = getConf();
