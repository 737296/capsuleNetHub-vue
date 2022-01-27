import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryBusinessTable (params) {
    return api.post(REST_URL.QUERY_BUSINESS_TABLE, params)
  },

  updateBusinessData (params) {
    if ('id' in params) {
      return api.post(REST_URL.UPDATE_BUSINESS_DATA, params)
    } else {
      return api.post(REST_URL.ADD_BUSINESS_DATA, params)
    }
  },

  delBusinessData (params) {
    return api.post(REST_URL.DEL_BUSINESS_DATA, params, {confirm: {}})
  },

  getExtBusinessTable (params) {
    return api.post(REST_URL.QUERY_EXTBUSINESS_TABLE, params)
  },

  updateExtProductMaintenance (params) {
    if ('id' in params) {
      return api.post(REST_URL.UPDATE_EXTBUSINESS_DATA, params)
    } else {
      return api.post(REST_URL.ADD_EXTBUSINESS_DATA, params)
    }
  },

  getExtProductDetails (params) {
    return api.post(REST_URL.QUERY_EXTBUSINESSDETAILS_TABLE, params)
  },

  delExtBusinessData (params) {
    return api.post(REST_URL.DEL_EXTBUSINESS_DATA, params, {confirm: {}})
  }
}
