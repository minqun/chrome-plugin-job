/*
 * @Author: your name
 * @Date: 2022-04-12 14:30:02
 * @LastEditTime: 2022-07-23 22:35:40
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /payPlus/src/content-scripts/ContentScripts.jsx
 */

import React, { useReducer, useMemo } from 'react'
import { render } from 'react-dom'
import { reducer, initialState, AppContext } from '@/hook/userStyle'
import Home from './Home'
import { appDom } from '@/lib'
const App = () => {
  const [store, dispatch] = useReducer(reducer, initialState)
  const cacheState = useMemo(() => [store, dispatch], [store])
  return (
    <AppContext.Provider value={cacheState}>
     <Home />
    </AppContext.Provider>
  )
}
export default Plus => {
  render(<App />, document.getElementById(appDom))
}
