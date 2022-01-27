// import { appRouter } from '@/router/router';
import Util from '@/libs/util'
import Vue from 'vue'
const { Base64 } = require('js-base64')

const app = {
  state: {
    cachePage: [],
    lang: '',
    isFullScreen: false,
    openedSubmenuArr: [], // 要展开的菜单数组
    menuTheme: 'dark', // 主题
    themeColor: '',
    pageOpenedList: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ],
    currentPageName: '',
    currentPath: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ], // 面包屑数组
    menuList: [],
    // 所有动态路由
    routers: [],
    tagsList: [],
    messageCount: 0,
    // 外部服务
    externalServices: [],
    dontCache: [] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
  },
  mutations: {
    updateExternalServices (state, services) {
      if (Array.isArray(services)) {
        state.externalServices = services
      } else {
        !state.externalServices && (state.externalServices = [])
        state.externalServices.push(services)
      }
    },
    setTagsList (state, list) {
      state.tagsList.push(...list)
    },
    updateRouters (state, routers) {
      state.routers = routers
    },
    updateMenulist (state) {
      let accessCode = Base64.decode(localStorage.getItem('access'))
      let menuList = []
      state.routers.forEach((item, index) => {
        if (item.access !== undefined) {
          if (Util.showThisRoute(item.access, accessCode)) {
            if (item.children.length === 1) {
              menuList.push(item)
            } else {
              let len = menuList.push(item)
              let childrenArr = []
              childrenArr = item.children.filter(child => {
                if (child.access !== undefined) {
                  // if (child.access === accessCode) {
                  if (Util.showThisRoute(child.access, accessCode)) {
                    return child
                  }
                } else {
                  return child
                }
              })
              menuList[len - 1].children = childrenArr
            }
          }
        } else {
          if (item.children.length === 1) {
            menuList.push(item)
          } else {
            let len = menuList.push(item)
            let childrenArr = []
            childrenArr = item.children.filter(child => {
              if (child.access !== undefined) {
                // if (child.access === accessCode) {
                if (Util.showThisRoute(child.access, accessCode)) {
                  return child
                }
              } else {
                return child
              }
            })
            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]))
            handledItem.children = childrenArr
            menuList.splice(len - 1, 1, handledItem)
          }
        }
      })
      state.menuList = menuList
    },
    changeMenuTheme (state, theme) {
      state.menuTheme = theme
    },
    changeMainTheme (state, mainTheme) {
      state.themeColor = mainTheme
    },
    addOpenSubmenu (state, name) {
      // let hasThisName = false;
      // let isEmpty = false;
      // if (name.length === 0) {
      //     isEmpty = true;
      // }
      // if (state.openedSubmenuArr.indexOf(name) > -1) {
      //     hasThisName = true;
      // }
      // if (!hasThisName && !isEmpty) {
      //     state.openedSubmenuArr.push(name);
      // }
      state.openedSubmenuArr = []
      state.openedSubmenuArr.push(name)
      console.log(name)
    },
    removeTag (state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1)
        }
      })
    },
    pageOpenedList (state, get) {
      let openedPage = state.pageOpenedList[get.index]
      if (get.argu) {
        openedPage.argu = get.argu
      }
      if (get.query) {
        openedPage.query = get.query
      }
      state.pageOpenedList.splice(get.index, 1, openedPage)
      // localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    setCurrentPath (state, pathArr) {
      state.currentPath = pathArr
      state.cachePage = (pathArr || []).map(({name}) => name)
    },
    setCurrentPageName (state, name) {
      state.currentPageName = name
    },
    // setAvator (state, path) {
    //   localStorage.avatorImgPath = path
    // },
    switchLang (state, lang) {
      state.lang = lang
      Vue.config.lang = lang
    },
    clearOpenedSubmenu (state) {
      state.openedSubmenuArr.length = 0
    },
    setMessageCount (state, count) {
      state.messageCount = count
    },
    increateTag (state, tagObj) {
      state.pageOpenedList.push(tagObj)
    }
  }
}

export default app
