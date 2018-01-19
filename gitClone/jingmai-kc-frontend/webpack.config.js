const {
  resolve
} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const precss = require('precss');
const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    //background: './src/background/background.js',
    index: './src/main.js',
  },
  output: {
    path: resolve(__dirname, 'build/dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/_dev/' : publicPath
  },
  module: {
    rules: [{
        test: /\.(vue|js)$/,
        enforce: 'pre',
        use: [
          {
            /*options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              
            },*/
            loader: 'eslint-loader',
          },
        ],
        include: resolve(__dirname, 'src'),
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [resolve('src'), resolve('node_modules/vue-echarts-v3/src')]
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve(__dirname, 'src'),
            attrs: ['img:src', 'link:href']
          }
        }]
      },
      {
        test:  /\.scss$/,
        use:  ["style!css!sass"]
      },
      {
        test:  /\.less$/,
        use:  ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({fallback:'style-loader', use:['css-loader', 'postcss-loader']})
      },
      {
        test: /favicon\.png$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    // short-circuits all Vue.js warning code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new ExtractTextPlugin('[name].[hash].css'), 
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['vendor','index']
    }),
    new webpack.LoaderOptionsPlugin({
         minimize: true,
         postcss: function() {
          return [autoprefixer, precss, cssnano, cssnext]
        },
    })
    /*
    // minify with dead-code elimination
    new webpack.optimize.UglifyJsPlugin({
     compress: {
       warnings: false
     }
    }),
    //optimize module ids by occurence count
    //new webpack.optimize.OccurenceOrderPlugin()*/
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '~': resolve(__dirname, 'src'),
      components: resolve(__dirname, './src/components')
    }
  },
  devServer: {
    disableHostCheck: true,
    host: 'dev.wen.xibao100.com',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://jingmai-kc.dev.xibao100.com',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/_dev/' : publicPath).pathname
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/_dev/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
