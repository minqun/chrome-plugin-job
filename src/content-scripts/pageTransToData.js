/*
 * @Date: 2022-08-07 14:42:51
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-08 09:52:38
 * @FilePath: /erp-plugin/src/content-scripts/pageTransToData.js
 */
import $ from 'jquery'
export const analyzePageFn  = (platform) => {
    
    let product = $('script[type="application/ld+json"]').text();
    if (product) {
      product = JSON.parse(product)
    }
    const desc =  $('div[class="markup -mhm -pvl -oxa -sc"]').html();

    return {
      product,
      desc
    }
  
}
export const productDataCreate = (platform) => {
  let product = {
    "comments": '',
    "detailDescription": '',
    "pictureUrlList": '',
    "price": '',
    "priceUnit": '',
    "productSourceCode": '',
    "simpleDescription": '',
    "title": ''
  }
  if (['taobao'].includes(platform)) {
    
  } else if (['jumia'].includes(platform)) {
    let info = $('script[type*="application/ld+json"]').text();
    if (info) {
      info = JSON.parse(info)
      product.title = prd?.mainEntity?.name
      product.url = window.location.href
      product.pictureUrlList = prd?.mainEntity?.image?.contentUrl
      product.price = prd?.mainEntity?.offers?.price
      product.priceUnit = prd?.mainEntity?.offers?.priceCurrency
      product.productSourceCode = platform
      product.detailDescription = $('div[class*="markup -mhm -pvl -oxa -sc"]').html(); 
      product.simpleDescription = $("div[class*='row -pas']").html()
      product.comments = ''
    }
  } else if (['lazada'].includes(platform)) {
   
  } else if (['aliexpress'].includes(platform)) {
    let info = $('script[type="application/ld+json"]').text();
    if (info) {
      product = JSON.parse(info)
    }
    const desc =  $('div[class="markup -mhm -pvl -oxa -sc"]').html();
    
  } else if (['shopee'].includes(platform)) {
    
  }
  return product
}
