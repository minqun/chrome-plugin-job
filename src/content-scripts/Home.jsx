/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-05-11 11:08:23
 * @LastEditors: M.re c1029mq@qq.com
 * @LastEditTime: 2022-08-10 15:05:56
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
function Home(props) {
  const [store, dispatch] = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const [platform, getPlatform] = useState(null)
  const [noProduct, getNoProduct] = useState(false)
  const [productData, setProductData] = useState(null)
  const [data, setData] = useState({})
  const [errorData, setErrorData] = useState(undefined)
  const [successData, setSuccessData] = useState(undefined)
  
  const lang = langData[store.lang]
  useEffect(() => {
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
    }, 2000)
    let platformIs = patPlatform()
    if (/xiapibuy|shopee/.test(platformIs)) {
      platformIs = 'shopee'
    }
    getPlatform(platformIs)
    let checkedVerify = checkProduct(platformIs)
    getNoProduct(checkedVerify)
  }, [])
  useEffect(async () => {
    if (platform) {
    }
  }, [platform])
  useEffect(async () => {
    console.log('platform::-productData', productData)
  }, [productData])

  const handleCollection = async () => {
    setLoading(true)
    setProductData(productDataCreate(platform))
    setLoading(false)
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
  const collectionUpload = () => {
    setLoading(true)
    // 上传到系统
    contentClient
      .sendMessage(new ChromeMessage('connect-post', { data: productData, token: store.loginInfo?.token }))
      .then(res => {
        console.log('结果，', res)
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
                {store.loginInfo?.username}
              </span>
            </div>
          </div>
          <div className={Styles['yjp-repire-btn-wrap']}>
            <Button
              disabled={!noProduct}
              onClick={productData?.url ? collectionUpload : handleCollection}
              className={`${Styles['c-btn']}`}
              type="primary"
              loading={loading}
            >
              {productData?.url ? lang.home.upload : loading ? lang.home.collecting : lang.home.collection}
            </Button>
            <div className={Styles['yjp-repire-btn-wrap-cell']}>
              <Button
                disabled={!productData?.url}
                onClick={collectionExportHandle}
                className={`${Styles['c-i-btn']}`}
                type="primary"
                loading={exportLoading}
              >
                {lang.home.down}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home
