/*
 * @Author: your name
 * @Date: 2022-04-12 11:42:15
 * @LastEditTime: 2022-07-23 22:42:22
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /payPlus/config/webpack.dev.js
 */
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
const reloadServer = require('./ReloadServer')
// const CompilerEmitPlugin = require('./plugins/CompilerEmitPlugin')
const webpack = require('webpack')

module.exports = () =>
  merge(commonConfig, {
    entry: {
      popup: './src/popup',
      background: ['./src/background'],
      contentScripts: ['./src/content-scripts'],
      options: './src/options',
    },

    devtool: 'source-map',
    plugins: [
      // new CompilerEmitPlugin()
      // new webpack.DefinePlugin({
      //   API_HOST: JSON.stringify('https://test-api-portal-shoplus.algobuy.net')
      // })
    ],
    devServer: {
      lazy: false,
      port: 8083,
      // 将 bundle 写到磁盘而不是内存
      writeToDisk: true,
      before(app) {
        reloadServer(app)
      },
    },
  })
