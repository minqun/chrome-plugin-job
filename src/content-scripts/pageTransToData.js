/*
 * @Date: 2022-08-07 14:42:51
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-30 20:55:02
 * @FilePath: /erp-plugin/src/content-scripts/pageTransToData.js
 */
import $ from 'jquery'
import { contentClient, ChromeMessage } from '@/chrome'

export const productDataCreate = async (platform, callback, target) => {
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
    callback(product)
  }  else if (['1688'].includes(platform)) {

    let imgList = []
    $(`${target||''} .img-list-wrapper`).find('img').map((key, item) => {
      imgList.push(item.src)
    })
    let str = ''
    str += $('.od-pc-offer-cross').html()
    str += $('.od-pc-attribute').html()
    let detail = ''
    $(`${target||''} .od-pc-detail-description`).find('img').map((key,item) => {
      let src = $(item).attr('data-lazyload-src')
      $(item).attr('src', src)
    })
    detail +=  $(`${target||''} .od-pc-detail-description`).html()
    product.title = $(`${target||''} title`).html()
    product.url = window.location.href
    product.pictureUrlList = imgList.length && imgList || []
    product.price =  $('.price-text').eq(0).html()
    product.priceUnit = 'RMB'
    product.productSourceCode = platform
    product.detailDescription = detail 
    product.simpleDescription = str
    callback(product)
    
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
      $('.markup.-mhm.-pvl.-oxa').find('img').map((key, item)  => {
        let target = $(item).attr('data-src') || item.src
        item.src = target.replace('150x150/','500x500/')
      })
      const html = document.querySelector('.markup.-mhm.-pvl.-oxa').innerHTML
      console.log(html)

      console.log(html.replace(/<strong.{0,}?>((.)+?<\/strong>)/g, '$1').replace('<\/strong>', ''))
      product.detailDescription = html.replace(/<strong.{0,}?>((.)+?<\/strong>)/g, '$1').replace('<\/strong>', '');
      let str = document.querySelector('.markup.-pam').innerHTML
      product.simpleDescription = str
      callback(product)
    }
  } else if (['lazada'].includes(platform)) {
    let prd = $('script[type*="application/ld+json"]').text();
    let imgList = []
    $('.next-slick-list').find('img').map((key, item) => {
      imgList.push(item.src.replace('_120x120', '_720x720'))
    })
    if (prd) {
      let info = prd.replace(/^\n/, '').split(/\n/)
      prd = info && info[0] &&  JSON.parse(info[0]) || {}
      product.title = prd?.name
      product.url = prd?.offers?.url
      product.pictureUrlList = imgList.length && imgList || prd?.image
      product.price = prd?.offers?.price * 0.001
      product.priceUnit = prd?.offers?.priceCurrency
      product.productSourceCode = platform
      let detail = $('.pdp-product-desc').html()
      product.detailDescription = detail
      product.simpleDescription = $('.pdp-mod-specification').html()
      callback(product)
      
    }
  } else if (['aliexpress'].includes(platform)) {
    if (window.location.host == 'm.aliexpress.com') {
      let prd = $('script[type*="application/ld+json"]').text();
      let prdArr = JSON.parse(prd)
      if (prd && prdArr && prdArr.length) {
          prd = prdArr.find(item => item['@type'] == 'Product')
          product.title = prd?.name
          product.url = prd?.offers?.url
          product.pictureUrlList = prd?.image
          product.price = prd?.offers?.price.replace(/[^\d|\.|,]/g,'' )
          product.priceUnit = prd?.offers?.priceCurrency
          product.productSourceCode = platform
      }
      const fdmm = () => {
        return new Promise((resolve, reject)=>{
          let str = '';
          let length = 20
          $('div[ae_button_type="new_specifications_viewmore_click"]').click()

          let sttim = setInterval(()=>{
            if ($('.comet-drawer-body').html()) {
              str =$('.comet-drawer-body').html()
              $('.comet-icon-close').click()
              clearInterval(sttim)
              resolve(str)
            } 
          
          }, 1000)
        })
      }
      product.simpleDescription = await fdmm()
      let link = $('iframe[class*="overview--iframe-"]').attr('src')
      console.log('link....', link)
      contentClient
      .sendMessage(new ChromeMessage('connect-link', { data: link }))
      .then(res => {
        console.log(res, '-----html')
        product.detailDescription = res

        callback(product)
      })

    } else {
      let prd = $('script[type*="application/ld+json"]').text();
      let imgList = []
      $('.images-view-list').find('img').map((key, item) => {
        imgList.push(item.src.replace('_50x50', '_Q90'))
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
          const fdm = () => {
            return new Promise((resolve)=>{
              let str = '';
              $('.detail-tab-bar li[ae_button_type=tab_specs]').click()
              let sttim = setInterval(()=>{
                if ($('.product-detail-tab .product-specs').html()) {
                  str = $('.product-detail-tab .product-specs').html()
                  clearInterval(sttim)
                  resolve(str)
                }
              }, 1000)
            })
          }
          const fdd = () => {
            return new Promise((resolve,reject)=>{
              let str = '';
          
              let sttim = setInterval(()=>{
                console.log($('div[class*="product-overview"]').children())
                if ($('div[class*="product-overview"]').children().length) {
                  str = $('div[class*="product-overview"]').html()
                  clearInterval(sttim)
                  resolve(str)
                }
              }, 1000)
            })
          }
          let simpleDescription = await fdm()
          product.detailDescription = await fdd()
          console.log(simpleDescription, 'simpleDescription')
          product.simpleDescription = simpleDescription
          callback(product)
        }
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
      product.detailDescription = document.querySelectorAll('._2jz573')[1] && $(document.querySelectorAll('._2jz573')[1]).html()
      product.simpleDescription = document.querySelectorAll('._2jz573')[0] &&  $(document.querySelectorAll('._2jz573')[1]).html()
      callback(product)
    }
  }
  
}
