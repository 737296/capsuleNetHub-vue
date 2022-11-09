import axios from 'axios'
import store from '../store'
import iview from 'iview'
const http = axios.create({
  // baseURL: 'http://192.168.116.108:8081',
  // baseURL: 'http://192.168.117.72:8081',
  baseURL: 'http://localhost:8080',
  // baseURL: 'http://172.25.218.53:80',
  // baseURL: 'http://yapi.tortoisecloud.com:13003/mock/295',
  // baseURL: 'http://172.25.217.222:30666',
  // baseURL: process.env.API_BASE_URL,
  headers: {
    post: {
      'Content-Type': 'application/json'
    },
    patch: {
      'Content-Type': 'application/json'
    }
  },
  responseType: 'json',
  validateStatus: status => true,
  timeout: 300 * 1000
})
const http123 = axios.create({
  // baseURL: 'http://192.168.119.209:8081',
  // baseURL: 'http://localhost:80',
  // baseURL: 'http://172.25.218.53:80',
  // baseURL: 'http://yapi.tortoisecloud.com:13003/mock/295',
  // baseURL: 'http://172.25.217.222:30666',
  // baseURL: process.env.API_BASE_URL,

  validateStatus: status => true,
  timeout: 300 * 1000
})

/**
 * 操作确认
 */
const operaConfirm = (config) => {
  if (config.confirm) {
    const { title = '操作提醒', content = '确认执行操作?', okText = '确认', cancelText = '取消' } = config.confirm
    return new Promise((resolve, reject) => {
      iview.Modal.confirm({
        title,
        content,
        okText,
        cancelText,
        onOk: () => {
          resolve(config)
        },
        onCancel: () => {
          reject(new Error('用户取消'))
        }
      })
    })
  } else {
    return Promise.resolve(config)
  }
}

// 请求拦截器
http.interceptors.request.use(
  config => {
    let { userInfo } = store.state.user
    if (userInfo && userInfo.accessToken) config.headers.accessToken = userInfo.accessToken
    return operaConfirm(config)
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  res => {
    if (!res || !res.data) throw new Error('Bad gate way')
    try {
      if (res.data.code === 2009) {
        iview.Message.info(res.data.msg)
        import('@/api/login').then(({ loginApi }) => {
          loginApi.logout()
        })
      }
    } catch (err) { console.log(err) }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export const api = http

export default {
  install (Vue, config) {
    Vue.prototype.$http = api
    Vue.prototype.$http123 = http123
  }
}
