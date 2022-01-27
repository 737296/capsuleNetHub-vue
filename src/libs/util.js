import store from '../store'
import { OTHER_ROUTER } from '../utils/constantData.js'

let util = {

}
util.title = function (title) {
  title = title || 'PAYHUB 支付中心Portal'
  window.document.title = title
}

util.inOf = function (arr, targetArr) {
  let res = true
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

util.oneOfArray = function (ele, targetArr) {
  let result = false
  for (let item of targetArr) {
    if (parseInt(item) === ele) {
      result = true
      return true
    }
  }
  return result
}

util.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
    return util.oneOf(currentAccess, itAccess)
  } else if (typeof currentAccess === 'string' && currentAccess.indexOf(',') > -1) {
    return util.oneOfArray(itAccess, currentAccess.split(','))
  } else {
    return itAccess === parseInt(currentAccess)
  }
}

util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null
  }
  // debugger;
  let routerObj = null
  for (let item of routers) {
    if (item.name === name) {
      return item
    }
    routerObj = util.getRouterObjByName(item.children, name)
    if (routerObj) {
      return routerObj
    }
  }
  return null
}

util.getRouterObjByAccess = function (routers, access) {
  if (!access || !routers || !routers.length) {
    return null
  }
  // debugger;
  let routerObj = null
  for (let item of routers) {
    if (item.access === parseInt(access)) {
      return item
    }
    routerObj = util.getRouterObjByAccess(item.children, access)
    if (routerObj) {
      return routerObj
    }
  }
  return null
}

util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n)
  } else {
    return item.title
  }
}

util.setCurrentPath = function (vm, name) {
  let currentPathArr
  let recursiveMethod = item => {
    currentPathArr.push({
      title: util.handleTitle(vm, item),
      path: item.component ? item.path : '',
      name: item.name
    })

    if (item.name === name) {
      store.commit('setCurrentPath', currentPathArr)
      return currentPathArr
    }

    if (item.children && item.children.length) {
      for (let child of item.children) {
        let result = recursiveMethod(child)
        if (result) return result
        currentPathArr.splice(-1, 1)
      }
    }

    return false
  }
  for (let item of store.state.app.routers) {
    currentPathArr = []
    let result = recursiveMethod(item)
    if (result) {
      return result
    }
  }

  let currentPageInfo = {
    title: '???',
    path: '',
    name: name
  }
  for (let item of OTHER_ROUTER) {
    item.name === name && (currentPageInfo.title = item.title)
  }
  let currentPath = store.state.app.currentPath
  if (currentPath[currentPath.length - 1].name !== currentPageInfo.name) {
    let currentPath = store.state.app.currentPath.concat([currentPageInfo])
    store.commit('setCurrentPath', currentPath)
  }
  return currentPath
}

util.openNewPage = function (vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList
  let openedPageLen = pageOpenedList.length
  let i = 0
  let tagHasOpened = false
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      })
      tagHasOpened = true
      break
    }
    i++
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children) {
        return name === item.children[0].name
      } else {
        return name === item.name
      }
    })
    tag = tag[0]
    if (tag) {
      tag = tag.children ? tag.children[0] : tag
      if (argu) {
        tag.argu = argu
      }
      if (query) {
        tag.query = query
      }
      vm.$store.commit('increateTag', tag)
    }
  }
  vm.$store.commit('setCurrentPageName', name)
}

util.toDefaultPage = function (routers, name, route, next) {
  let len = routers.length
  let i = 0
  let notHandle = true
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      })
      notHandle = false
      next()
      break
    }
    i++
  }
  if (notHandle) {
    next()
  }
}

util.fullscreenEvent = function (vm) {
  vm.$store.commit('initCachepage')
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist')
  // 全屏相关
}

export default util
