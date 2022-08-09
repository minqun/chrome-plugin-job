/* eslint-disable global-require */
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

const rootDir = path.resolve(__dirname, '..')
// const wrapperClassName = `chrome-extension-base-class${Math.floor(Math.random() * 10000)}`
const postCssPlugins = [
  require('autoprefixer'),
]

module.exports = {
  entry: {
    popup: './src/popup',
    background: './src/background',
    contentScripts: './src/content-scripts',
    options: './src/options',
  },
  output: {
    path: path.resolve(rootDir, './dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  useBuiltIns: 'usage',
                  corejs: {
                    version: 3,
                    proposals: true,
                  },
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties'],
              [
                'babel-plugin-import',
                {
                  libraryName: 'antd',
                  libraryDirectory: 'es',
                  style: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: postCssPlugins,
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: postCssPlugins,
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#01C08A',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },

      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: postCssPlugins,
              },
            },
          },

          {
            loader: 'sass-loader',
            // options: {
            //   additionalData: `
            //     @import "src/assets/style/init.scss";`,
            // },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/[name]-[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '../src') },
    extensions: ['.js', '.jsx'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
      // , path.resolve(rootDir, 'src/assets/style/init.scss')
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(rootDir, 'public/icons'),
          to: path.resolve(rootDir, 'dist/icons'),
        },
        {
          from: path.resolve(rootDir, 'public/_locales'),
          to: path.resolve(rootDir, 'dist/_locales'),
        },
        {
          from: path.resolve(rootDir, 'public/images'),
          to: path.resolve(rootDir, 'dist/images'),
        },
        {
          from: path.resolve(rootDir, 'public/lib'),
          to: path.resolve(rootDir, 'dist/lib'),
        },
        {
          from: path.resolve(rootDir, 'public/manifest.json'),
          to: path.resolve(rootDir, 'dist/manifest.json'),
        },
        {
          from: path.resolve(rootDir, 'public/rules.json'),
          to: path.resolve(rootDir, 'dist/rules.json'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'public/popup.html'),
      filename: path.resolve(rootDir, 'dist/popup.html'),
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'public/options.html'),
      filename: path.resolve(rootDir, 'dist/options.html'),
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'public/background.html'),
      filename: path.resolve(rootDir, 'dist/background.html'),
      chunks: ['background'],
    }),
    // new webpack.DefinePlugin({
    // WRAPPER_CLASS_NAME: `'${wrapperClassName}'`,
    // }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          archive: [{ source: './dist', destination: './dist/ejp-reptile.zip' }],
        },
      },
    }),
  ],
}
