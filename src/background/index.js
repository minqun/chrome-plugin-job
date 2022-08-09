/*
 * @Author: your name
 * @Date: 2022-04-12 14:30:02
 * @LastEditTime: 2022-08-07 14:22:09
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /erp-plugin/src/background/index.js
 */

import {contentClient, set, get} from '@/chrome';
import config from '@/config/index.js';

// 监听客户端消息 - 接收connect
contentClient.listen ('connect-post', (data, sendResponse) => {
  console.log(data)
  if (data.msg == 'connect-post') {
    fetch (
      config.api + '/online-retailer/spider/data', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Ci9K7zZ0inpcMLGH9jA58198E832U2Meorg#34'
        },
        body: JSON.stringify(data.params)
      }
    )
      .then (res => res.text ())
      .then (res => {
        sendResponse (res);
      })
      .catch (e => {
        console.log ('error:', e);
      });
  }
});
contentClient.listen ('connect-login', (data, sendResponse) => {
  if (data.msg == 'connect-login') {
    fetch (
      `${config.api}`
    )
      .then (res => res.text ())
      .then (res => {
          sendResponse (res);
      })
      .catch (e => {
        console.log ('error:', e);
      });
  }
});

// 接收长链接返回信息
chrome.runtime.onConnect.addListener (function (port) {
  if (port.name == 'sock-info') {
    port.onMessage.addListener (function (request) {
      console.log ('收到长连接消息：', request);
    });
  }
});


