/*
 * @Author: your name
 * @Date: 2022-04-12 14:30:02
 * @LastEditTime: 2022-07-21 14:24:58
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /chrome-spy-plugin-h5/src/options/index.jsx
 */
// import config from '@/config/index.js'
// const timmer =  setInterval(()=> {
//   try {
   
//     if (window && window.Shopify ) {
//       const json = {[config.extensionId]: {...(window && window.Shopify), host: window.location} }
//       const info = JSON.stringify(json)
//       window.postMessage(info, '*') 
//       clearInterval(timmer)
//     }
//   } catch (e) {
//     console.log('error:', e)
//   }
  
// },1000)
    

// var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
// ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-228117531-1';
// var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// window.dataLayer = window.dataLayer || [];
// function huntGtag(){dataLayer.push(arguments);}
// huntGtag('js', new Date());
// huntGtag('config', 'UA-228117531-1');
// huntGtag('click', 'init', {
//   'event_category': '初始化',
//   'event_label': 'origin',
//   'value': window.location.href
// })

if (window.location.host == 'data.similarweb.com') {
  var domain = window.location.href.split ('domain=')[1];
  
  if (
    !document.documentElement.innerHTML.includes ('<meta charset="utf-8">') &&
    domain
  ) {
    document.documentElement.innerHTML = '';
    window.location.href = 'https://www.similarweb.com/website/' + domain;
  }
}
 


