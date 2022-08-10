/*
 * @Author: your name
 * @Date: 2022-04-15 09:51:02
 * @LastEditTime: 2022-08-10 13:24:53
 * @LastEditors: M.re c1029mq@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /erp-plugin/src/lib/index.js
 */
import moment from 'moment'
import $ from 'jquery'
import { JSEncrypt } from 'jsencrypt'
import config from '@/config/index.js';
const info = require('../../package.json')
class AnimateCall {
  constructor(props) {
    this.animateDispatch = {}
    this.curRef = {}
    this.timmer = setInterval(() => {
      Object.keys(this.animateDispatch).map(item => {
        this.animateDispatch[item].time = this.animateDispatch[item].time - props.time
        if (this.animateDispatch[item].time <= 0) {
          this.animateDispatch[item].del && this.animateDispatch[item].del()
          if (this.curRef[item]) {
            const regex = new RegExp(' ' + this.animateDispatch[item].className, 'g')
            this.curRef[item].className = this.curRef[item].className.replace(regex, '')
          }
          delete this.animateDispatch[item]
        }
      })
    }, props.time)
  }
  setAnt(ref, name) {
    this.curRef[name] = ref
  }
  add(name, className, time, action, del) {
    this.animateDispatch[name] = {
      time,
      name,
      className,
      action,
      del,
    }
    if (this.curRef[name]) {
      this.curRef[name].className = this.curRef[name].className + ' ' + className
    }
    this.animateDispatch[name].action && this.animateDispatch[name].action()
    this.check(name)
  }
  check(name) {
    console.log(Object.keys(this.animateDispatch), this.curRef[name], this.curRef, '队列')
  }
}

export const antCall = new AnimateCall({ time: 100 })
/**
 * @description: 动画队列
 * @param {*} name 动画名
 * @param {*} className 动画类
 * @param {*} time 动画时间
 * @param {*} action 动画开始执行函数
 * @param {*} del 动画结束执行
 * @return {*}
 */
export const animateCall = (name, className, time, action, del) => {
  antCall.add(name, className, time, action, del)
}
const appId = () => info.version + info.name
export const getStringMonth = (year, month) => {
  return `${moment()
    .month(Number(month) - 1)
    .year(year)
    .format('MMM,YYYY')}`
}
export const appDom = appId()
/**
 * @description: 
 * @param {*} reg   RegExp
 * @param {*} context document
 * @param {*} index exec arr index
 * @param {*} type  json/txt
 * @return {*}
 */
export const reg = (reg, context, index =1) => {
  try {
    return reg.exec(context) && reg.exec(context)[index] && JSON.parse(reg.exec(context)[index])
  } catch (e) {
    return reg.exec(context) && reg.exec(context)[index]
  }
}

export const transformShoplineProducts = (data) => {
  let productInfo = ''
  if (/__PRELOAD_STATE__.products=(.+)<\/script>/.exec(data)) {
    let info = /__PRELOAD_STATE__.products=(.+)<\/script>/.exec(data)
    productInfo = JSON.parse(info && info[1].substring(0,info[1].length -1).replace(/`/g,''))
  }
  return productInfo
}
export const getContainer = () => document.getElementById('chrome-content-plugin-card')
export const getCollectionContainer = () => document.getElementById('uuspy-dialog-wrapper')
export const deep = function f(obj) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)
  var newObj = {} // 保持继承链
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 不遍历其原型链上的属性
      var val = obj[key]
      newObj[key] = typeof val === 'object' ? f(val) : val // 使用arguments.callee解除与函数名的耦合
    }
  }
  return newObj
}
/**
 * @description:  近其时间转换
 * @param {*} time
 * @return {*}
 */
export const countDays = time => {
  let dateTime = new Date(time)
  // 如果为null,则格式化当前时间
  if (!dateTime) dateTime = Number(new Date())
  // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
  if (dateTime.toString().length == 10) dateTime *= 1000
  let timestamp = +new Date(Number(dateTime))

  let timer = (Number(new Date()) - timestamp) / 1000
  // 如果小于5分钟,则返回"刚刚",其他以此类推
  let tips = ''
  switch (true) {
    case timer < 300:
      tips = 'just'
      break
    case timer >= 300 && timer < 3600:
      tips = parseInt(timer / 60) + ' minutes ago'
      break
    case timer >= 3600 && timer < 86400:
      tips = parseInt(timer / 3600) + ' hours ago'
      break
    case timer >= 86400 && timer < 2592000:
      tips = parseInt(timer / 86400) + ' days ago'
      break
    default:
      if (timer >= 2592000 && timer < 365 * 86400) {
        tips = parseInt(timer / (86400 * 30)) + ' months ago'
      } else {
        tips = parseInt(timer / (86400 * 365)) + ' years ago'
      }
  }
  return tips
}
/**
 * 优化数字四舍五入
 * @param {*} num  // 数值
 * @param {*} pz // 小数点位数
 */
export const floatBeat = (num, pz) => {
  let str = String(num)
  if (str.includes('.')) {
    let nrr = str.split('.')
    let n = nrr[1] || ''
    n = '0.' + nrr[1]
    if (nrr[1].substr(pz, 1) === 5 && num.toFixed(pz) < num) {
      let an = Number().toFixed(pz) + '1'

      nrr[1] = Number(n) + Number(an)
    } else {
      nrr[1] = Number(n).toFixed(pz)
    }
    let perz = Number(nrr[0]) + Number(nrr[1])
    return perz.toFixed(pz)
  } else {
    return num.toFixed(pz)
  }
}

/**
 * @desc 数字格式化 - 默认返回 num
 * @param {Array} num - 处理数字
 * @param {Array} precision - 小数点位数
 * @param {Function} separator - 分隔号不传为''
 * @param {Function} pz - 后缀
 */
export const formatNumberMix = (num, precision = 2, separator, pz) => {
  let parts
  let minus = ''
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num)
    if (num === 0) {
      let zerostr = new Array(precision).fill(0).join('')
      return zerostr ? '0.' + zerostr : '0'
    }
    // 判断负数

    if (num < 0) {
      minus = String(num).substr(0, 1)
      num = Math.abs(num)
    }

    // 处理小数点位数
    num = (typeof precision !== 'undefined' ? floatBeat(num, precision) : num).toString()
    // 分离数字的小数部分和整数部分
    parts = num.split('.')
    // 整数部分加[separator]分隔, 借用一个著名的正则表达式
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ''))

    if (pz) {
      return minus ? minus + parts.join('.') + pz : parts.join('.') + pz
    } else {
      return minus ? minus + parts.join('.') : parts.join('.')
    }
  }

  return minus ? minus + num : num
}

/**
 * @description: 数字量级转换
 * @param {*} e
 * @return {*}
 */
export const miniNum = e => {
  let str = String(e)
  let sr = str.split('.')
  let n = sr[0].length
  let slit = 1
  let dm = ''
  if (n >= 4) {
    slit = 0.001
    dm = 'K'
  }
  if (n >= 7) {
    slit = 0.000001
    dm = 'M'
  }
  if (n >= 10) {
    slit = 0.000000001
    dm = 'B'
  }
  let data = e * slit
  let dataPoint = String(data).split('.')
  if (dataPoint.length > 1 && dataPoint[0] !== '0') {
    return data.toFixed(2) + dm
  } else {
    return data + dm
  }
}
export const _local = {
  // 存储,可设置过期时间
  set(key, value, expires) {
    const params = { key, value, expires }
    if (expires) {
      // 记录何时将值存入缓存，毫秒级
      var data = Object.assign(params, { startTime: new Date().getTime() })
      try {
        localStorage.setItem(key, JSON.stringify(data))
      } catch (e) {
        console.log('error:', e)
      }
    } else {
      if (
        Object.prototype.toString.call(value) === '[object Object]' ||
        Object.prototype.toString.call(value) === '[object Array]'
      ) {
        value = JSON.stringify(value)
      }
      try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.log('error:', e)
    }
    }
  },
  // 取出
  get(key) {
    let item = localStorage.getItem(key)
    // 先将拿到的试着进行json转为对象的形式
    try {
      item = JSON.parse(item)
    } catch (error) {
      // eslint-disable-next-line no-self-assign
      item = item
    }
    // 如果有startTime的值，说明设置了失效时间
    if (item && item.startTime) {
      const date = new Date().getTime()
      // 如果大于就是过期了，如果小于或等于就还没过期
      if (date - item.startTime > item.expires) {
        localStorage.removeItem(name)
        return false
      } else {
        return item.value
      }
    } else {
      return item
    }
  },
  // 删除
  remove(key) {
    localStorage.removeItem(key)
  },
  // 清除全部
  clear() {
    localStorage.clear()
  },
}
/**
 * @description: 首字大写转换
 * @param {*} str
 * @return {*}
 */
export const upperFirst = str => {
  const strNew = str.split('')
  strNew[0] = strNew[0].toUpperCase()
  return strNew.join('')
}
/**
 * @description: -首字大写转换
 * @param {*} str
 * @return {*}
 */
 export const upperFirstGan = str => {
  const strNew = str.split('-')
  return strNew.map(item =>upperFirst(item)).join(' ')
}

/**
 * @description: 社交媒体列表
 * @return {*} array
 */
export const socialMedias = () => {
  const context = document.documentElement.innerHTML
  const obj = {
    facebook: {
      check: false,
      icon: 'facebook',
      reg: /<a(.)+facebook.com\/(([^("|')]+)")?/i,
      link: 'https://facebook.com/',
    },
    youtube: {
      check: false,
      icon: 'youtube',
      reg: /<a(.)+youtube.com\/(([^("|')]+)")?/i,
      link: 'https://youtube.com/',
    },
    twitter: {
      check: false,
      icon: 'twitter',
      reg: /<a(.)+twitter.com\/(([^("|')]+)")?/i,
      link: 'https://twitter.com/',
    },
    instagram: {
      check: false,
      icon: 'instagram',
      reg: /<a(.)+instagram.com\/(([^("|')]+)")?/i,
      link: 'https://instagram.com/',
    },
    pinterest: {
      check: false,
      icon: 'pinterest',
      reg: /<a(.)+pinterest.com\/(([^("|')]+)")?/i,
      link: 'https://pinterest.com/',
    },
    'pinterest.co.uk': {
      check: false,
      icon: 'pinterest',
      reg: /<a(.)+pinterest.co.uk\/(([^("|')]+)")?/i,
      link: 'https://pinterest.co.uk/',
    },
  }
  const collectSocial = []
  Object.keys(obj).forEach(item => {
    if (obj[item].reg.exec(context) && obj[item].reg.exec(context)[3]) {
      obj[item].check = true
      obj[item].link = obj[item].link + obj[item].reg.exec(context)[3]
      collectSocial.push(obj[item])
    }
  })
  return collectSocial
}
/**
 * @name: 明文密码加密
 * @msg:
 * @param {*} password
 * @return {*}
 */

export const passwordEncrypt = password => {
  let pwd = password + ''
  let jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(config.pubKey)
  return jsencrypt.encrypt(pwd.trim())
}
/**
 * @description: 数字转换 - 空值处理
 * @param {*} val
 * @return {*}
 */
export const filterData = val => {
  if (val) {
    return formatNumberMix(val, 0, ',')
  } else {
    return '--'
  }
}
/**
 * @description: data- 空值处理
 * @param {*} val
 * @return {*}
 */
 export const deelData = val => {
  if (val || String(val) == '0' ) {
    return val
  } else {
    return '--'
  }
}
/**
 * @description:  数组切割
 * @param {*} arr
 * @param {*} chunkSize
 * @return {*}
 */
 export const sliceIntoChunks = (arr, chunkSize) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
  }
  return res;
}
/**
 * @description: 获取链接地址参数
 * @param {*} url
 * @return {*}
 */
export const getQueryParams = url => {
  url = url || location.href
  const splitList = url.split('?')
  url = splitList[1] || ''
  const params = url
    .split('&')
    .filter(Boolean)
    .reduce((obj, item) => {
      const [key, value] = item.split('=')
      const val = decodeURIComponent(value)
      if (Array.isArray(obj[key])) {
        obj[key].push(val)
      } else if (typeof obj[key] === 'string') {
        obj[key] = [obj[key], val]
      } else {
        obj[key] = val
      }
      return obj
    }, {})
  return params
}
export const defData  = (data) => {
  if (data == 'Verify') {
    return undefined
  }
  return data != null && typeof data == 'object' ? data :typeof data == 'string' ? JSON.parse(data) : undefined
  
}
export const checkProduct  = (platform) => {
  const content = document.documentElement.innerHTML
  let href = window.location.href
  if (['taobao'].includes(platform)) {
    return content.includes('envMode :product')
  } else if (['jumia', 'lazada', 'aliexpress'].includes(platform)) {
    return /-\w{8,9}.html/.test(href) || /\/[0-9]{11}.html/.test(href) || /\/s[0-9]{11}.html/.test(href)
  }else if (['shopee'].includes(platform)) {
    return window.location.search && window.location.search.includes('sp_atk=') || window.location.pathname.includes('product')
  }

}
export const patPlatform = (host) => /(jumia|lazada|aliexpress|taobao|1688|xiapibuy|shopee)\./.exec(host||window.location.host)[1]
