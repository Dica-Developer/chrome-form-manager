const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');
const SRC = path.resolve(__dirname, 'src');
const DIST = path.resolve(__dirname, 'dist');
const IS_DIST = process.env.NODE_ENV === "production";

const extractSass = new ExtractTextPlugin({
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
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.scss/,
                    use: extractSass.extract({
                        use: [{
                            loader: 'css-loader',
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: false,
                                plugins: () => [
                                    require('autoprefixer')(),
                                    require('cssnano')()
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false,
                                includePaths: [
                                    'node_modules',
                                    'node_modules/normalize-scss/sass'
                                ]
                            }
                        }]
                    })
                }
            ]
        },
        plugins: [extractSass]
    };

    if (IS_DIST) {
    }

    return config;
}

module.exports = getConf();
