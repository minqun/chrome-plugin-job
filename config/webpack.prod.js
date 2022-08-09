/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-04-12 11:42:15
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-06-16 09:40:18
 * @FilePath: /chrome-spy-plugin-h5/config/webpack.prod.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const commonConfig = require('./webpack.common.js')

module.exports = () =>
  merge(commonConfig, {
    devtool: 'source-map',
    plugins: [
      // new webpack.DefinePlugin({
      //   API_HOST: JSON.stringify('https://api-portal.shoplus.net')
      // })
    ]
  })
