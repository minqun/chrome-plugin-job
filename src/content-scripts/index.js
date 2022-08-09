/*
 * @Author: your name
 * @Date: 2022-04-12 14:30:02
 * @LastEditTime: 2022-08-07 11:05:26
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /erp-plugin/src/content-scripts/index.js
 */
import Plugin from './ContentScripts.jsx'
import { get, set, getUrl, contentClient, ChromeMessage } from '@/chrome'
import config from '@/config/index.js'
import $ from 'jquery'
const packageConfig = require('../../package.json')
import { appDom, _local ,patPlatform, checkProduct} from '@/lib'
import mixpanel from 'mixpanel-browser'
const uuid = require('node-uuid')

class CreateElDom {
  constructor () {
    const dom = document.createElement ('div');
    dom.id = appDom;
    dom.className = 'notranslate'
    dom.style =
      'position: fixed;bottom:152px;height: 0px;width: auto;right: 60px; z-index:2147483899; ';
    document.documentElement.appendChild (dom);
  }
  injectCustomJs(jsPath) {
    var tempCss = document.createElement('link')
    tempCss.id = 'message-plugin-spy-options-styles'
    tempCss.rel = 'stylesheet'
    tempCss.scoped = true
    tempCss.href = getUrl('css/contentScripts.css?v=1')
    document.documentElement.appendChild(tempCss)
    var temp = document.createElement('style')
    temp.id = 'message-plugin-spy-options-css'
    temp.innerHTML = `.highcharts-credits {
			opacity: 0;
		}`
    tempCss.onload = () => {
      new Plugin()
      document.documentElement.appendChild(temp)
    }
  }
}
const vi = [
  'shopee.cl',
  'shopee.com.co',
  'shopee.com.my',
  'shopee.co.id',
  'shopee.co.th',
  'shopee.ph',
  'shopee.sg',
  'shopee.vn',
  'shopee.com.br',
  'shopee.com.mx',
  'my.xiapibuy.com',
  'id.xiapibuy.com',
  'th.xiapibuy.com',
  'ph.xiapibuy.com',
  'sg.xiapibuy.com',
  'vn.xiapibuy.com',
  'br.xiapibuy.com',
  'mx.xiapibuy.com',
  'co.xiapibuy.com',
  'cl.xiapibuy.com',
  'www.jumia.com.ng',
  'www.jumia.ci',
  'www.jumia.ma',
  'www.jumia.co.ke',
  'www.jumia.com.eg',
  'www.jumia.com.gh',
  'www.jumia.sn',
  'www.jumia.ug',
  'aliexpress.ru',
  'campaign.aliexpress.com',
  'promotion.aliexpress.ru',
  'www.aliexpress.com',
  'plaza.aliexpress.com',
  'm.aliexpress.com',
  'www.lazada.vn',
  'pages.lazada.vn',
  'www.lazada.co.th',
  'pages.lazada.co.th',
  'www.lazada.co.th',
  'www.lazada.sg',
  'pages.lazada.sg',
  'www.lazada.com.ph',
  'pages.lazada.com.ph',
  'www.lazada.com.my',
  'pages.lazada.com.my',
  'www.lazada.co.id',
  'pages.lazada.co.id'

]
let timer = null
let host  = window.location.host
if (vi.includes(host)) {  
    const App = new CreateElDom()
    App.injectCustomJs()
  
}


