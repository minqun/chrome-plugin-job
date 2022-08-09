/*
 * @Descripttion:
 * @version:
 * @Author: ared
 * @Date: 2022-05-31 14:24:42
 * @LastEditors: ared
 * @LastEditTime: 2022-06-29 16:05:51
 */
/* eslint-disable no-undef */
function set(key, value) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve(value)
    })
  })
}

function get(key) {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, result => {
      resolve(result[key])
    })
  })
}
function remove(keys = []) {
  return new Promise(resolve => {
    chrome.storage.sync.remove(keys, () => {
      resolve()
    })
  })
}
export { set, get, remove }
