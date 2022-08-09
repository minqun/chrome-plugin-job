/*
 * @Author: M.re c1029mq@qq.com
 * @Date: 2022-04-12 14:30:02
 * @LastEditors: ared
 * @LastEditTime: 2022-06-16 18:23:57
 * @FilePath: /chrome-spy-plugin-h5/src/api/request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
// import { reducer, initialState} from '@/hook/userStyle'

axios.defaults.withCredentials = true
axios.interceptors.response.use(
  res => {
    return res
  },
  error => {
    if (error.response && error.response.status === 401) {
    }
    return error
  }
)
export async function request(options, methods) {
  const response = await axios(options)
  if (response.data?.code == 401 && methods) {
    methods.dispatch({
      type: 'update',
      updates: [['loginInfo', {}]],
    })
    methods.visitDispatch({
      type: 'update',
      updates: [['loginVisible', true]],
    })
  }
  return (response && response.data) || {}
}
