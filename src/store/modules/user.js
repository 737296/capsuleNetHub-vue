const user = {
  state: {
    userInfo: {},
    ssoInfo: {}
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userInfo = payload
    },
    setSsoInfo (state, payload) {
      state.ssoInfo = payload
    }
  }
}

export default user
