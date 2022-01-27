import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_ROLE_TABLE, params)
  },

  updateData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_ROLE_DATA, params)
    } else {
      return api.post(REST_URL.ADD_ROLE_DATA, params)
    }
  },

  getDetails (params) {
    return api.post(REST_URL.QUERY_ROLE_DATA, params)
  },

  delData (params) {
    return api.post(REST_URL.DEL_ROLE_DATA, params, {confirm: {}})
  }
}
