/*
 * @Date: 2022-07-21 14:26:42
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-10 15:16:17
 * @FilePath: /erp-plugin/src/options/index.jsx
 */

import { get, set, contentClient,  ChromeMessage, getUrl} from '@/chrome'
import Cookie from 'js-cookie'
const html = `
<div style="width: 300px;margin: 15% auto;">
<div style="display:flex;line-height: 40px;font-size: 16px;align-items: center;justify-content: center;">
<span id="msg">插件连接中</span><span style="margin-right: 3px;"></span>
<svg t="1660059950759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2307" width="20" height="20"><path d="M675.328 117.717333a21.333333 21.333333 0 0 1-16.341333 39.402667A382.762667 382.762667 0 0 0 512 128C299.925333 128 128 299.925333 128 512s171.925333 384 384 384 384-171.925333 384-384c0-51.114667-9.984-100.8-29.12-146.986667a21.333333 21.333333 0 0 1 39.402667-16.341333A425.429333 425.429333 0 0 1 938.666667 512c0 235.648-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333c56.746667 0 112 11.093333 163.328 32.384z m-170.88 281.152a21.290667 21.290667 0 0 1 0.042667-30.208l82.986666-82.986666a63.850667 63.850667 0 0 1 90.432 0.021333l60.373334 60.394667a63.914667 63.914667 0 0 1 0.064 90.410666l-150.997334 150.997334a63.829333 63.829333 0 0 1-90.410666-0.042667l-30.229334-30.229333a21.269333 21.269333 0 0 1 0-30.165334 21.290667 21.290667 0 0 1 30.186667 0l30.208 30.229334a21.162667 21.162667 0 0 0 30.08 0.042666l150.997333-150.997333a21.248 21.248 0 0 0-0.042666-30.08l-60.394667-60.373333a21.184 21.184 0 0 0-30.101333-0.021334l-82.986667 82.986667a21.333333 21.333333 0 0 1-30.208 0z m15.104 226.261334a21.290667 21.290667 0 0 1-0.042667 30.208l-82.986666 82.986666a63.850667 63.850667 0 0 1-90.432-0.021333l-60.373334-60.394667a63.914667 63.914667 0 0 1-0.064-90.410666l150.997334-150.997334a63.829333 63.829333 0 0 1 90.410666 0.042667l30.229334 30.229333a21.269333 21.269333 0 0 1 0 30.165334 21.290667 21.290667 0 0 1-30.186667 0l-30.208-30.229334a21.162667 21.162667 0 0 0-30.08-0.042666l-150.997333 150.997333a21.248 21.248 0 0 0 0.042666 30.08l60.394667 60.373333a21.184 21.184 0 0 0 30.101333 0.021334l82.986667-82.986667a21.333333 21.333333 0 0 1 30.208 0z" fill="#3D3D3D" p-id="2308"></path></svg>
</div>
<div id="lenths" style="font-size: 18px;text-align: center;">.......................</div>
</div>


`
function lenthsAdd () {
  var i = 20
    var tim= setInterval(function(){
    if (i> 0) {
      i-=1
      document.getElementById('lenths').innerHTML =  document.getElementById('lenths').innerHTML + '.'
    }else {
      document.getElementById('msg').innerHTML = '插件连接成功'
      clearInterval(tim)
    }
   },100)
 }
if (window.location.href.includes('szyijingpai.com/verify')) {
    get('token-info').then(data => {
      if (!data ||  (data && data.token != Cookie.get('saasToken')))  {
        set('token-info', {
          token: Cookie.get('saasToken'),
          username: Cookie.get('userName')
        }).then(data=> {
          document.body.className = ''
          document.body.innerHTML = html
          lenthsAdd()
        })
      }
    })
    if (!Cookie.get('saasToken')) {
      window.location.href = '/'
    }
} else if (window.location.href.includes('szyijingpai.com')) {
  get('token-info').then(data => {
    console.log(!data ||  (data && data.token != Cookie.get('saasToken')), '是否不同步')
    if (!data ||  (data && data.token != Cookie.get('saasToken'))) {
      set('token-info', {
        token: Cookie.get('saasToken'),
        username: Cookie.get('userName')
      }).then(data=> {
        contentClient
        .sendMessage (
          new ChromeMessage ('update-token', {data})
        )
        .then (res => {
         console.log('更新token')
        });
      })
    } 
  })
}



