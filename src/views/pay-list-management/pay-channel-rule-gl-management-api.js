import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryPayChannelTable (params) {
    return api.post(REST_URL.QUERY_PAYCHANNEL_GL_TABLE, params)
  },

  updatePayChannelData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_PAYCHANNEL_GL_DATA, params)
    } else {
      return api.post(REST_URL.ADD_PAYCHANNEL_GL_DATA, params)
    }
  },

  delPayChannelData (params) {
    return api.post(REST_URL.DEL_PAYCHANNEL_GL_DATA, params, {confirm: {}})
  },

  queryExtProductTable (params) {
    return api.post(REST_URL.QUERY_EXTPRODUCT_GL_TABLE, params)
  },
  updateExtProductRule (params) {
    if ('id' in params) {
      return api.post(REST_URL.UPDATE_EXTPRODUCTRULE_GL_DATA, params)
    } else {
      return api.post(REST_URL.ADD_EXTPRODUCTRULE_GL_DATA, params)
    }
  },
  delExtProductRule (params) {
    return api.post(REST_URL.DEL_EXTPRODUCTRULE_GL_DATA, params, {confirm: {}})
  }
}
