/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-05-12 15:23:41
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-07 11:34:13
 * @FilePath: /erp-plugin/src/api/home.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { request } from './request'

export const postSave = data => {
  const url = 'http://120.76.240.88:8031/online-retailer/spider/data'
  console.log('来了，有错误吧',url,data)
  return request({
    method: 'POSt',
    url,
    data: data,
  })
}
