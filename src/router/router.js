import Main from '@/views/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: process.env.SSO_LOGIN ? '登录确认中...' : 'Login - 登录'
    },
    component: () => import(process.env.SSO_LOGIN ? '@/views/sso-login' : '@/views/login')
  },
  {
    path: '/logout',
    meta: {
      title: '账户已退出'
    },
    name: 'logout',
    component: () => import('@/views/logout')
  },
  {
    path: '/forbidden',
    meta: {
      title: '暂无访问权限'
    },
    name: 'forbidden',
    component: () => import('@/views/logout')
  }
]

export const errorPages = [
  {
    path: '/403',
    meta: {
      title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => {
      require(['@/views/error-page/403.vue'], resolve)
    }
  },
  {
    path: '/500',
    meta: {
      title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => {
      require(['@/views/error-page/500.vue'], resolve)
    }
  },
  // /* 要放在最后
  {
    path: '/*',
    name: 'error-404',
    meta: {
      title: '404-页面不存在'
    },
    component: resolve => {
      require(['@/views/error-page/404.vue'], resolve)
    }
  }
]

export const mainRouter = {
  path: '/',
  name: 'home',
  redirect: { name: 'home_index' },
  component: Main,
  children: [
    {
      path: 'home',
      title: 'home',
      name: 'home_index',
      component: resolve => {
        require(['@/views/home/home.vue'], resolve)
      }
    }
  ]
}

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  ...loginRouter,
  mainRouter
]
