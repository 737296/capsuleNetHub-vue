import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_USER_TABLE, params)
  },

  updateData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_USER_DATA, params)
    } else {
      return api.post(REST_URL.ADD_USER_DATA, params)
    }
  },

  delData (params) {
    return api.post(REST_URL.DEL_USER_DATA, params, {confirm: {}})
  }
}
