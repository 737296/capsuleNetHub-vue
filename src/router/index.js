import iView from 'iview'
import VueRouter from 'vue-router'
import store from '@/store'
import Util from '@/libs/util'
import { getPathParams } from '@/utils/common'
import { setRouterData, addRoutes, removeRoutes, ssoLogin } from '@/utils/dynamic-router'
import { routers } from './router'

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers,
  base: process.env.UI_BASE_URL
}

export const router = new VueRouter(RouterConfig)

setRouterData({router, RouterConfig})

router.beforeEach((to, from, next) => {
  const { userInfo: {
    manualLogout,
    ssoFail,
    params: { code: failCode } = {},
    menus = [],
    accessToken
  } = {} } = store.state.user
  iView.LoadingBar.start()
  Util.title(to.meta.title)

  // 用户禁止登录
  if (ssoFail && failCode && failCode === Object.assign(to.params || {}, getPathParams()).code) {
    to.name !== 'forbidden' ? next({ name: 'forbidden' }) : next()
  } else if (manualLogout) {
    // 手动退出的
    to.name !== 'logout' ? next({ name: 'logout' }) : next()
  } else if (accessToken) {
    // 未登录
    addRoutes().then((added) => {
      // 默认进第一个路由动态
      const {
        routers: [
          {
            children: [
              {
                name: nextRouterName
              } = {}
            ] = []
          } = {}
        ],
        currentPageName
      } = store.state.app

      // 没有菜单权限
      if (process.env.SSO_LOGIN && menus.length <= 0) {
        to.name !== 'forbidden' ? next({ name: 'forbidden' }) : next()
      } else if (to.name !== 'home_index') {
        added ? next() : next({ name: currentPageName, query: to.query, params: to.params })
      } else {
        router.replace({ name: nextRouterName })
      }
    })
  } else {
    removeRoutes()
    to.name !== 'login' ? next({ name: 'login' }) : next()
    ssoLogin(to.params)
  }
})

router.afterEach((to) => {
  console.log(to)
  Util.openNewPage(router.app, to.name, to.params, to.query)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export const plugin = {
  install (Vue, config) {
    Vue._addDynamicRoutes = addRoutes
    Vue._removeDynamicRoutes = removeRoutes
  }
}
