/*
 * @Date: 2022-08-07 14:42:51
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-10 21:40:23
 * @FilePath: /erp-plugin/src/content-scripts/pageTransToData.js
 */
import $ from 'jquery'
export const productDataCreate = (platform) => {
  let product = {
    // "comments": '',
    "detailDescription": '',
    "pictureUrlList": '',
    "price": '',
    "priceUnit": '',
    "productSourceCode": '',
    "simpleDescription": '',
    "title": ''
  }
  if (['taobao'].includes(platform)) {
    let imgList = []
    $('#J_UlThumb').find('img').map((key, item) => {
      imgList.push(item.src)
    })
    product.title = $('.tb-main-title').attr('data-title')
    product.url = window.location.href
    product.pictureUrlList = imgList.length && imgList || []
    product.price = $('.tb-rmb-num').html()
    product.priceUnit = 'RMB'
    product.productSourceCode = platform
    product.detailDescription = $('#J_DivItemDesc').html(); 
    product.simpleDescription = $('#attributes').html()
    
  }  else if (['1688'].includes(platform)) {
    let imgList = []
    $('.img-list-wrapper').find('img').map((key, item) => {
      imgList.push(item.src)
    })
    let str = ''
    let detail = ''
    $('.od-pc-attribute').parent().children().map((key,item) => {
      if (key < 1) {
        str += $(item).html()
      } else {
        detail += $(item).html()
      }
      
    })
   
    product.title = $('title').html()
    product.url = window.location.href
    product.pictureUrlList = imgList.length && imgList || []
    product.price =  $('.price-text').eq(0).html()
    product.priceUnit = 'RMB'
    product.productSourceCode = platform
    product.detailDescription = detail 
    product.simpleDescription = str
    
  } else if (['jumia'].includes(platform)) {
    let prd = $('script[type*="application/ld+json"]').text();
    if (prd) {
      prd = JSON.parse(prd)
      product.title = prd?.mainEntity?.name
      product.url = window.location.href
      product.pictureUrlList = prd?.mainEntity?.image?.contentUrl
      product.price = prd?.mainEntity?.offers?.price
      product.priceUnit = prd?.mainEntity?.offers?.priceCurrency
      product.productSourceCode = platform
      product.detailDescription = $('div[class*="markup -mhm -pvl -oxa -sc"]').html(); 
      product.simpleDescription = $("div[class*='row -pas']").html()
      // product.comments = ''
    }
  } else if (['lazada'].includes(platform)) {
    let prd = $('script[type*="application/ld+json"]').text();
    let imgList = []
    $('.next-slick-list').find('img').map((key, item) => {
      imgList.push(item.src)
    })
    if (prd) {
      let info = prd.replace(/^\n/, '').split(/\n/)
      prd = info && info[0] &&  JSON.parse(info[0]) || {}
      console.log('prd', prd)
      product.title = prd?.name
      product.url = prd?.offers?.url
      product.pictureUrlList = imgList.length && imgList || prd?.image
      product.price = prd?.offers?.price * 0.001
      product.priceUnit = prd?.offers?.priceCurrency
      product.productSourceCode = platform
      product.detailDescription = $('.detail-content').html(); 
      product.simpleDescription = $('.html-content').html()
    }
  } else if (['aliexpress'].includes(platform)) {
    let prd = $('script[type*="application/ld+json"]').text();
    let imgList = []
    $('.images-view-list').find('img').map((key, item) => {
      imgList.push(item.src)
    })
    
    let prdArr = JSON.parse(prd)
    if (prd && prdArr && prdArr.length) {
      prd = prdArr.find(item => item['@type'] == 'Product')
      product.title = prd?.name
      product.url = prd?.offers?.url
      product.pictureUrlList = imgList.length && imgList || prd?.image
      product.price = prd?.offers?.price
      product.priceUnit = prd?.offers?.priceCurrency
      product.productSourceCode = platform
      product.detailDescription = $('div[class*="product-overview"]').html(); 
      product.simpleDescription = $('.product-specs').html()
    }
  } else if (['shopee'].includes(platform)) {
    let prd = {}
    $('script[type*="application/ld+json"]').map((key, item)=>{
      if ($(item).text().includes('"@type":"Product"')) {
        prd = JSON.parse($(item).text())
        return 
      }
    })
    console.log(prd, 'prd', $(".flex-column").children())
    console.log($("div[class*='product-detail']").children())
    if (prd) {
      let children = $("div[class*='product-detail']").children()
      let imgChild = $(".flex-column").children()
      let imgList = []
      if (imgChild && $(imgChild[1])){
        $(imgChild[1]).find('div[style*="background-image:"]').map((key,item) => {
          console.log(key, item)
          imgList.push($(item).attr('style').match(/url\("([^\)]+)"\)/)[1])
        })
      }
      product.title = prd?.name
      product.url = window.location.href
      product.pictureUrlList = imgList.length && imgList || prd?.image
      product.price = prd?.offers?.price  || prd?.offers?.lowPrice || prd?.offers?.highPrice
      product.priceUnit = prd?.offers?.priceCurrency
      product.productSourceCode = platform
      product.detailDescription = children && children[1] && $(children[1]).find('div:nth-child(2)').html() 
      product.simpleDescription = children && children[0] && $(children[0]).find('div:nth-child(2)').html()  
      // product.comments = ''
    }
  }
  return product
}
