import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'
import modules from './modules'
// 状态管理
Vue.use(Vuex)

const store = new Vuex.Store({ modules,
  plugins: [createPersistedState({
    storage: window.sessionStorage
  }),
  process.env.NODE_ENV !== 'production' ? createLogger() : () => {}
  ]
})

export default store
