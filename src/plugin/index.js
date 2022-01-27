import Vue from 'vue'
import qs from 'qs'
import VueRouter from 'vue-router'
// ui框架
import iView from 'iview'
// import echarts from 'echarts';
// 网络请求
import axios from '../api'

// 路由
import { plugin as routerPlugin } from '../router'
import {formatDate} from '@/utils/date-tool'

import { commonUtils } from '../utils/common'

import Components from '../components'

Vue.use(axios)
Vue.use(VueRouter)

Vue.use(commonUtils)

Vue.use(qs)

Vue.use(iView)

Vue.use(routerPlugin)

Vue.use(Components)

Vue.use({
  install (vue, config) {
    console.log('安装自定义插件')
    // vue.prototype.$echarts = echarts;
    vue.prototype.$formatDate = formatDate
    const on = vue.prototype.$on
    vue.prototype.$on = function (event, func) {
      // 等待时间(毫秒)
      const waitTime = 1000
      // 上次执行时间
      let previous = 0
      let newFunc = func
      if (event === 'click') {
        newFunc = function () {
          const now = Date.now()
          if (now >= previous + waitTime) {
            func.apply(this, arguments)
            previous = now
          }
        }
      }
      on.call(this, event, newFunc)
    }
  }
})
