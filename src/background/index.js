/*
 * @Author: your name
 * @Date: 2022-04-12 14:30:02
 * @LastEditTime: 2022-08-10 14:54:07
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /erp-plugin/src/background/index.js
 */

import { contentClient, set, get } from '@/chrome'
import config from '@/config/index.js'

// 监听客户端消息 - 接收connect
contentClient.listen('connect-post', (data, sendResponse) => {
  console.log(data)
  if (data.msg == 'connect-post') {
    fetch(config.api + '/online-retailer/spider/data', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: data.params?.token,
      },
      body: JSON.stringify({
        errorMessage: '',
        productSourceCode: data.params?.data.productSourceCode,
        success: true,
        targetUrl: data.params?.data.url,
        data: data.params?.data,
      }),
    })
      .then(res => res.json())
      .then(res => {
        sendResponse(res)
      })
      .catch(e => {
        console.log('error:', e)
      })
  }
})
contentClient.listen('update-token', (data, sendResponse) => {
  console.log('data', data)
  if (data.msg == 'update-token') {
    set('update-token', data.params.data)
    sendResponse('ok')
  }
})
async function getCurrentTab() {
  chrome.tabs.create({
    url: `${config.host}/verify`,
  })
  // let queryOptions = {
  //   url: '*://*.szyijingpai.com/*',
  // };
  // // `tab` will either be a `tabs.Tab` instance or `undefined`.
  // let [tab] = await chrome.tabs.query (queryOptions);
  // // 设置utm 记录
  // console.log('tab--', tab)
  // chrome.tabs.captureVisibleTab(tab.windowId)
  // // if (tab && tab.url) {
  // //   set('token', tab && tab.url).then(res => {
  // //     if (res && res.split('?')[1]) {
  // //       const params = res.split('?')[1] || ''

  // //     }
  // //   })
  // // } else {
  // //   set('set-utm', '')
  // // }
}
// init
chrome.runtime.onInstalled.addListener(reson => {
  console.log('onInstall plugin', reson)
  getCurrentTab()
  // chrome.runtime.reload()
})

// 接收长链接返回信息
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == 'sock-info') {
    port.onMessage.addListener(function (request) {
      console.log('收到长连接消息：', request)
    })
  }
})
