import store from '@/store'
import { REST_URL } from '@/utils/restUrl.js'
import { api } from './index.js'

export const loginApi = {
  // 胶囊网络登录
  capsulelogin (params) {
    return api.post(REST_URL.CAPSULE_LOGIN, params).then((res) => {
      store.commit('setUserInfo', { account: res.data.data.name, accessToken: 'xxxxxxxxxxx' })
      return res
    })
  },
  login (params) { // 登录
    if (process.env.SSO_LOGIN) {
      return api.post(REST_URL.LOGIN, params).then((res) => {
        if (res.data.code === 200) {
          store.commit('setSsoInfo', params)
          store.commit('setUserInfo', res.data.data)
          return Promise.resolve(res)
        } else if (res.data.code === 401) {
          store.commit('setUserInfo', {
            // 登录失败
            ssoFail: true,
            params
          })
          return Promise.resolve(res)
          // window.location.href = window.location.href.replace(window.location.search, '')
        } else {
          return Promise.reject(new Error(res.data.msg || '接口调用错误'))
        }
      })
    } else {
      return Promise.resolve().then(() => {
        store.commit('setUserInfo', { account: '测试账户', accessToken: 'xxxxxxxxxxx' })
        return Promise.resolve({ data: { code: 200 } })
      })
    }
  },
  ssoLogin (params) {
    return api.post(REST_URL.SSOLOGIN, params).then((res) => {
      const { data } = res
      if (data.code === 200) {
        window.location.href = data.data
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  },
  logout (params) { // 登出
    let url = REST_URL.LOGOUT
    return api.post(url, params).then((res) => {
      if (res.data.code === 200) {
        store.commit('setSsoInfo', {})
        store.commit('setUserInfo', {
          // 已经登出
          manualLogout: true
        })
        window.location.href = window.location.href.replace(window.location.search, '')
      }
      return Promise.resolve(res)
    })
  }
}
