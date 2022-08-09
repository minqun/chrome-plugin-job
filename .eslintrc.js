/*
 * @Author: your name
 * @Date: 2022-04-18 13:58:36
 * @LastEditTime: 2022-05-11 14:25:27
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /payPlus/.eslintrc.js
 */
module.exports = {
    settings: {
      'import/resolver': {
          alias: {
              map: [
                  ['~', path.resolve(__dirname, './src')],
                  ['@', path.resolve(__dirname, './src')],
              ],
          },
      },
  },
  "plugins": [
    "react-hooks"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  }
}
