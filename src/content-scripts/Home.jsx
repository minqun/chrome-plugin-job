/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-05-11 11:08:23
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-19 20:11:05
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-06-16 16:10:12
 * @FilePath: /erp-plugin/src/content-scripts/Home.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '@/hook/userStyle'
import { Button, Space, Alert } from 'antd'
import config from '@/config/index.js'

import langData from '@/lang'
import { productDataCreate } from './pageTransToData.js'
import { patPlatform, checkProduct } from '@/lib'
import { getUrl, contentClient, ChromeMessage, get, set } from '@/chrome'
import '@/content-scripts/comm.scss'
import $ from 'jquery'
import * as XLSX from 'xlsx'
import { postSave } from '@/api/home.js'
import Styles from '@/content-scripts/ContentScripts.module.scss'
let checked = true
let hash = window.location.href
function Home(props) {
  const [store, dispatch] = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [url, setUrl] = useState(undefined)
  const [platform, getPlatform] = useState(null)
  const [noProduct, getNoProduct] = useState(false)
  const [productData, setProductData] = useState(null)
  const [data, setData] = useState({})
  const [errorData, setErrorData] = useState(undefined)
  const [successData, setSuccessData] = useState(undefined)
  let count = 1;
  const lang = langData[store.lang]
  useEffect(async () => {
    get('token-info').then(updateInfo => {
      dispatch({
        type: 'update',
        updates: [['loginInfo', updateInfo]],
      })
    })
    setInterval(async () => {
      // 检测账号更新
      const updateInfo = await get('update-token')
      if (updateInfo && updateInfo.token && checked) {
        checked = false
        dispatch({
          type: 'update',
          updates: [['loginInfo', updateInfo]],
        })
        await set('token-info', updateInfo)
        set('update-token', '').then(() => {
          checked = true
          setErrorData(false)
        })
      }
      if((document.readyState == 'interactive' || document.readyState == 'complete') && count) {
        count = 0
        setReady(true)
      } 
    }, 1000)
    let platformIs = patPlatform()
    if (/xiapibuy|shopee/.test(platformIs)) {
      platformIs = 'shopee'
    }
    if (/tmall|taobao/.test(platformIs)) {
      platformIs = 'taobao'
    }
    getPlatform(platformIs)
    console.log('platformIs--------', platformIs)
    if (platformIs == 'shopee') {
      let check = await checkProduct(platformIs)
      getNoProduct(check)
      const tim = setInterval(async ()=>{
          if(window.location.href != hash) {
            count = 1
            setProductData(null)
            hash = window.location.href
           check = await checkProduct(platformIs)
            getNoProduct(check)
          }
        },1000);
    } else {
      let checkedVerify = await checkProduct(platformIs)
      console.log('checkProduct', checkedVerify)
      getNoProduct(checkedVerify)
    }
  }, [])
  useEffect(async () => {
    console.log('没刷新什么毛笔')
    if (platform) {
    }
  }, [platform])
  useEffect(async () => {
    console.log('platform::-productData', productData)
  }, [productData])

  const handleCollection = async () => {
    // TODO 限制
    // let limit = await get('limit')
    // limit = (limit || 100) - 1
    // await set('limit', limit)
    // console.log('limit', limit)
    // if (limit <= 0) return 
    setLoading(true)
    // contentClient
    // .sendMessage(new ChromeMessage('test', { data: productData, token: store.loginInfo?.token }))
    // .then(res => {
    //   console.log('采集到html 处理')
    //   console.log($(res))
    // })
    setTimeout(() => {
      productDataCreate(platform, (product)=> {
        console.log(product, 'product------------')
        setProductData(product)
        setLoading(false)
        collectionUpload(product)
      })
    }, 1000);
   
    
  }
  const collectionExportHandle = () => {
    // shopify 导出模板处理
    let exportData = [productData]
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
  const collectionUpload = (product) => {
    setLoading(true)
    // 上传到系统
    contentClient
      .sendMessage(new ChromeMessage('connect-post', { data: product, token: store.loginInfo?.token }))
      .then(res => {
        if (res && res.status == '500') {
          setErrorData(res.message)
        }else if (res && res.code == 0) {
          setSuccessData('操作成功')
          const timmer = setTimeout(() => {
            setSuccessData(undefined)
          }, 3000);
        }
        setLoading(false)
      })
  }

  return (
    <>
      <div className={`${Styles['yjp-repire-box-content']}`}>
        {errorData && (
          <Alert
            message={lang.home.error}
            showIcon
            className={Styles['tip-error']}
            description={errorData}
            type="error"
            action={
              <Button size="small" onClick={() => window.open(config.href)} danger>
                {lang.home.login}
              </Button>
            }
          />
        )}
        {
          successData && <Alert className={Styles['tip-error']} message={successData} type="success"  closable/>
        }

        <div className={`${Styles['yjp-repire-box']}`}>
          {/* {store.loginInfo?.token} */}
          <div className={Styles['cell-space']}>
            <img src={getUrl('images/logo.svg')} className={Styles['logo']} />
            <div className={Styles['yjp-repire-bwt']}>
              <span style={{ marginRight: '4px' }}> {lang.home.user}： </span>
              <span className={Styles['title-line-width']} title={store.loginInfo?.username}>
                {' '}
                {store.loginInfo?.username ? store.loginInfo?.username : <a href={config.href}>{lang.home.login}</a>}
              </span>
            </div>
          </div>
          <div className={Styles['yjp-repire-btn-wrap']}>
            <Button
              disabled={!noProduct }
              onClick={ready ? handleCollection : () => {}}
              className={`${Styles['c-btn']}`}
              type="primary"
              loading={loading}
            >
              {/* {productData?.url ? lang.home.upload : loading ? lang.home.collecting : ready ? lang.home.collection: lang.home.ready_wait} */}
              {loading ? lang.home.collecting : ready ? lang.home.collection: lang.home.ready_wait}
            </Button>
            {/* <div className={Styles['yjp-repire-btn-wrap-cell']}>
              <Button
                disabled={!productData?.url}
                onClick={collectionExportHandle}
                className={`${Styles['c-i-btn']}`}
                type="primary"
                loading={exportLoading}
              >
                {lang.home.down}
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}
export default Home
