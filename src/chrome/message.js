/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-04-12 14:30:02
 * @LastEditors: ared
 * @LastEditTime: 2022-06-08 10:31:43
 * @FilePath: /chrome-spy-plugin-h5/src/chrome/message.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 统一消息格式
class ChromeMessage {
  constructor(msg, params) {
    this.msg = msg
    this.params = params
  }
}
// 获取函数的形参个数
function getFuncParameters(func) {
  if (typeof func === 'function') {
    const match = /[^(]+\(([^)]*)?\)/gm.exec(Function.prototype.toString.call(func))
    if (match[1]) {
      const args = match[1].replace(/[^,\w]*/g, '').split(',')
      return args.length
    }
  }

  return 0
}

// 监听回调函数
const listeners = {}

// 事件分发
function dispatchEvent(request, sendResponse) {
  const { msg } = request
  let callBack

  Object.keys(listeners).forEach(key => {
    if (key === msg) {
      callBack = listeners[key]
    }
  })

  if (callBack) {
    const paramSize = getFuncParameters(callBack)

    callBack(request, sendResponse)

    return paramSize === 2
  }

  return false
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const success = dispatchEvent(request, sendResponse)
  if (!success) {
    sendResponse(new ChromeMessage('Default Response1'))
  }
  return true
})

// content scripts 发送和监听消息
class ContentClient {
  listen(msg, callBack) {
    listeners[msg] = callBack
  }

  sendMessage(message) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(message, res => {
        resolve(res)
      })
    })
  }
}

// background 发送和监听消息
class BackgroundClient {
  listen(msg, callBack) {
    listeners[msg] = callBack
  }

  sendMessage(message) {
    return new Promise(resolve => {
      chrome.tabs.query({ active: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message, response => {
          resolve(response)
        })
      })
    })
  }
}

const contentClient = new ContentClient()
const backgroundClient = new BackgroundClient()

const sendMessage = name => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, name)
  })
}
export { contentClient, backgroundClient, ChromeMessage, sendMessage }
