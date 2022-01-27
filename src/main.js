import 'babel-polyfill'
import Vue from 'vue'
import './plugin'
// 路由
import { router } from './router'
// 仓库
import store from './store'
import App from './App.vue'
import 'iview/dist/styles/iview.css'

let { userInfo } = store.state.user
if (userInfo && userInfo.accessToken) { // 当已登录时获取公共数据
  // store.dispatch('requestCommonData').finally(initVue);
}

export const vueInstance = new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
})
