/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-06-20 10:09:16
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-30 21:06:57
 * @FilePath: /erp-plugin/src/config/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const HostList = {
  uat: 'http://www.uat.szyijingpai.com',
  prod: 'http://www.prod.szyijingpai.com',
  dev: 'http://192.168.0.113:8031'
}
const env = 'prod'
export default {
  "api": HostList[env],
  "href": HostList[env] + "/orgLogin",
  "host": HostList[env]
}
