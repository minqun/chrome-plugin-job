/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-05-11 11:08:23
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-08 00:07:40
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-06-16 16:10:12
 * @FilePath: /erp-plugin/src/content-scripts/Home.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '@/hook/userStyle'
import { Button, Space } from 'antd';
import langData from '@/lang'
import { analyzePageFn, productDataCreate } from './pageTransToData.js'
import {patPlatform, checkProduct } from '@/lib'
import { getUrl,contentClient,ChromeMessage } from '@/chrome'
import '@/content-scripts/comm.scss'
import $ from 'jquery'
import * as XLSX from 'xlsx'
import { postSave } from '@/api/home.js'
import Styles from '@/content-scripts/ContentScripts.module.scss'
function Home(props) {
  const [store, dispatch] = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [platform, getPlatform] = useState(null)
  const [noProduct, getNoProduct] = useState(false)
  const [productData, setProductData] = useState(null)
  const [data, setData]= useState({})
  const lang = langData[store.lang]
  useEffect(() => {
    let platformIs = patPlatform()
    if (/xiapibuy|shopee/.test(platformIs)) {
      platformIs = 'shopee'
    }
    getPlatform(platformIs)
    getNoProduct(checkProduct(platformIs))
  }, [])
  useEffect(async () => {
    console.log('platform::', platform)
    if (platform) {
      setProductData(productDataCreate(platform))
    }
  }, [platform])
  useEffect(async () => {
    console.log('platform::-productData', productData)
   
  }, [productData])
 
  const handleCollection = async () => {
    setLoading(true)
    const data = analyzePageFn()
    console.log(data)
    setData(data)
    setLoading(false)
  }
  const exportDataHandle = data => {
    let prd = data.product
    return [{
      'title': prd?.mainEntity?.name,
      'url': window.location.href,
      'image': prd?.mainEntity?.image?.contentUrl[0],
      'price': prd?.mainEntity?.offers?.price,
      'currency': prd?.mainEntity?.offers?.priceCurrency,
      'description': data.desc
    }]
  }
  const collectionExportHandle = () => {
    // shopify 导出模板处理
    let exportData = exportDataHandle(data)
    contentClient
      .sendMessage (
        new ChromeMessage ('connect-post', exportData[0])
      )
      .then (res => {
        console.log('结果，', res)
      });
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workcsv = XLSX.utils.sheet_to_csv(worksheet)
    // 解决excel乱码问题
    let BOM = '\uFEFF'
    let csvString = BOM + workcsv
    let a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvString)
    a.target = '_blank'
    a.download = `yjp_${String(exportData[0]?.title).toLowerCase().replace(' ', '_')}_product.csv`
    document.body.appendChild(a) // Firefox 中必须这么写，不然不会起效果
    a.click()
    document.body.removeChild(a)
  }

  return (
    <>
       <div className={`${Styles['yjp-repire-box']}`}>
                <img src={getUrl('images/logo.svg')} className={Styles['logo']}/>
                <Button disabled={!noProduct} onClick={data?.product ? collectionExportHandle : handleCollection} className={`${Styles['c-btn']}`} type="primary" loading={loading}>
                  {data?.product ? lang.home.down :loading ? lang.home.collecting: lang.home.collection }
                </Button>
            </div>
    </>
  )
}
export default Home
