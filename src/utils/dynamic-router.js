import debounce from 'lodash/debounce'
import iview from 'iview'
import VueRouter from 'vue-router'
import store from '@/store'
import { MENU_LIST, OTHER_ROUTER } from '@/utils/constantData.js'
import { ArrayObjectEach, copy, getPathParams } from '@/utils/common'
import { mainRouter, errorPages } from '@/router/router'
import { loginApi } from '@/api/login'

const GlobalData = {
  router: null,
  RouterConfig: null,
  /**
   * 是否已经添加了路由
   */
  dynamicRouterAdded: false
}

/**
 * 设置路由
 * @param {*} router 路由
 */
export const setRouterData = ({ router, RouterConfig }) => {
  GlobalData.router = router
  GlobalData.RouterConfig = RouterConfig
}

/**
 * 移除路由
 */
export const removeRoutes = () => {
  if (GlobalData.dynamicRouterAdded) {
    GlobalData.router.matcher = new VueRouter(GlobalData.RouterConfig).matcher
    GlobalData.dynamicRouterAdded = false
  }
}

export const ssoLogin = debounce(routerParams => {
  if (process.env.SSO_LOGIN) {
    const { code } = Object.assign(routerParams || {}, getPathParams())
    // 不是sso登录返回
    if (!code) {
      loginApi.ssoLogin().catch(res => {
        iview.Message.error(`登录失败！${res.data.msg}`)
      })
    } else {
      loginApi.login({ code })
        .then(res => {
          const { data: { code } } = res
          if (code === 200) {
            iview.Message.success('登录成功!')
          }
          GlobalData.router.push({ name: 'home_index' })
        })
        .catch(err => {
          console.log(err)
          iview.Message.error('授权失败, 请重新登录.')
          setTimeout(() => {
            loginApi.ssoLogin().catch(res => {
              iview.Message.error(`获取sso地址失败. ${res.data.msg}`)
            })
          }, 2500)
        })
    }
  }
}, 500)

/**
 * 添加路由
 */
export const addRoutes = () => {
  if (!GlobalData.dynamicRouterAdded) {
    const dynamicRouters = { ...mainRouter, redirect: null, children: [] }

    // const { menuRouters, otherRouters } = filterRouter()
    const { menuRouters } = filterRouter()

    // 这块根据用户权限过滤
    const menuRouterFilted = process.env.SSO_LOGIN
      ? menuRouters
      : MENU_LIST.filter(v => v)
    // const otherRouterFilted = process.env.SSO_LOGIN ? otherRouters : OTHER_ROUTER
    // 其他路由不过滤
    const otherRouterFilted = OTHER_ROUTER
    dynamicRouters.children = menuRouterFilted.reduce((sum, currVal) => {
      // currVal.children.push(...OTHER_ROUTER)
      currVal.children && sum.push(...currVal.children)
      return sum
    }, [])
    dynamicRouters.children.push(...otherRouterFilted)
    removeRoutes()
    GlobalData.router.addRoutes([dynamicRouters, ...errorPages])
    updateRouterInfo(menuRouterFilted, dynamicRouters)
    GlobalData.dynamicRouterAdded = true
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
}

/**
 * 根据权限过滤路由
 */
const filterRouter = () => {
  const {
    userInfo: { menus = [] }
  } = store.state.user
  // 遍历菜单，整理路由name作为key，配置作为值
  const menuRouterMap = {}
  ArrayObjectEach(MENU_LIST, (node, parent, key, depth) => {
    if (node && (!parent || key === 'children')) {
      menuRouterMap[node.name] = node
    }
  })

  // 遍历其他路由，整理路由name作为key，配置作为值
  const otherRouterMap = {}
  ArrayObjectEach(OTHER_ROUTER, (node, parent, key, depth) => {
    if (node && (!parent || key === 'children')) {
      otherRouterMap[node.name] = node
    }
  })

  const otherRouters = []
  // 路由过滤
  const filterMenuResult = []
  ArrayObjectEach(copy(menus) || [], (node, parent, key, depth) => {
    if (node) {
      if (!parent) {
        // 不在其他路由中,则加入到菜单路由
        const rou = otherRouterMap[node.href]
        if (!rou) {
          filterMenuResult.push(node)
        } else {
          otherRouters.push(node)
        }
      }
      // 树上的节点
      if ((node.children || []).length > 0) {
        // 字节的中的其他路由也过滤调
        node.children = node.children.filter(v => {
          const rou = otherRouterMap[v.href]
          rou && otherRouters.push(v)
          return !rou
        })
      }
    }
  })

  const dataMapping = (node, routerMap) => {
    const localRouter = routerMap[node.href]
    node.title = node.name
    node.name = node.href
    node.path = node.path || '/' + node.name
    node.component = localRouter && localRouter.component
  }

  // 清空外部服务
  store.commit('updateExternalServices', [])
  // 菜单路由处理
  ArrayObjectEach(filterMenuResult, (node, parent, key, depth) => {
    if (node && (!parent || key === 'children')) {
      if (node.children) {
        node.children = node.children.filter(v => {
          const test = /https?:\/\//.test(v.href)
          if (test) {
            store.commit('updateExternalServices', {
              name: v.name,
              path: v.href
            })
          }
          return !test
        })
      }
      dataMapping(node, menuRouterMap)
    }
  })

  // 其他路由处理
  otherRouters.forEach(v => {
    dataMapping(v, otherRouterMap)
  })

  return {
    menuRouters: filterMenuResult.filter(v => (v.children || []).length > 0),
    otherRouters
  }
}

const updateRouterInfo = (menuRouters, dynamicRouters) => {
  let tagsList = dynamicRouters.children
  store.commit('updateRouters', menuRouters)
  store.commit('setTagsList', tagsList)
}
