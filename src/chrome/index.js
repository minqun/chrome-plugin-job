/*
 * @Author: your name
 * @Date: 2022-04-12 14:30:02
 * @LastEditTime: 2022-06-29 16:01:58
 * @LastEditors: ared
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /payPlus/src/chrome/index.js
 */
import { get, set, remove } from './storage'
import { backgroundClient, contentClient, ChromeMessage, sendMessage } from './message'
import { create } from './contextMenus'
import { go } from './history'
import { reload } from './runtime'
const getUrl = path => chrome.runtime.getURL(path)
export { get, set, remove, backgroundClient, contentClient, ChromeMessage, create, go, reload, sendMessage, getUrl }
