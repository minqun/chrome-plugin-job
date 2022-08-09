/*
 * @Author: your name
 * @Date: 2022-04-12 14:30:02
 * @LastEditTime: 2022-07-18 23:59:05
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /payPlus/src/hook/userStyle.js
 */
import { createContext, useContext } from 'react'
import { get } from '@/chrome'
export const initialState = {
  lang: 'EN',
  loginInfo: {},
  emailValidated: false,
}
export const visitState = {
  actived: true,
  loginVisible: false,
  dialogVisible: false,
  loginVerify: false,
  dialogType: 'reset-password',
  loginType: 'in', // in: 登录 up: 注册
  alertMessage: [],
  collectionList: [], // 商品专辑列表
}
export const trafficState = {
  World: false,
  Overview: false,
  VistOver: false,
  RingGender: false,
  RingOver: false,
  RingSearch: false,
  BarAge: false,
  RingMedia: false,
}

export function reducer(store, action) {
  console.log('reducer ===', store)
  const updateState = { ...store }
  for (const [key, value] of action.updates.entries()) {
    updateState[value[0]] = value[1]
  }
  switch (action.type) {
    case 'update':
      return updateState
    default:
      throw new Error()
  }
}

export const AppContext = createContext(initialState)
export const VisitContext = createContext(visitState)
export const TrafficContext = createContext(trafficState)
