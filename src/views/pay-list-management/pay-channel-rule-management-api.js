import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryPayChannelTable (params) {
    return api.post(REST_URL.QUERY_PAYCHANNEL_TABLE, params)
  },

  updatePayChannelData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_PAYCHANNEL_DATA, params)
    } else {
      return api.post(REST_URL.ADD_PAYCHANNEL_DATA, params)
    }
  },

  delPayChannelData (params) {
    return api.post(REST_URL.DEL_PAYCHANNEL_DATA, params, {confirm: {}})
  },

  queryExtProductTable (params) {
    return api.post(REST_URL.QUERY_EXTPRODUCT_TABLE, params)
  },
  updateExtProductRule (params) {
    if ('id' in params) {
      return api.post(REST_URL.UPDATE_EXTPRODUCTRULE_DATA, params)
    } else {
      return api.post(REST_URL.ADD_EXTPRODUCTRULE_DATA, params)
    }
  },
  getExtProductRuleDetails (params) {
    return api.post(REST_URL.QUERY_EXTPRODUCTRULE_DATA, params)
  },
  delExtProductRule (params) {
    return api.post(REST_URL.DEL_EXTPRODUCTRULE_DATA, params, {confirm: {}})
  },

  queryExtUserTable (params) {
    return api.post(REST_URL.QUERY_EXTUSER_TABLE, params)
  },
  updateExtUserRule  (params) {
    if ('id' in params) {
      return api.post(REST_URL.UPDATE_EXTUSERRULE_DATA, params)
    } else {
      return api.post(REST_URL.ADD_EXTUSERRULE_DATA, params)
    }
  },

  fileImportUserRule (file, params) {
    const forms = new FormData()
    forms.append('file', file)
    params && Object.keys(params).forEach((key) => {
      forms.append(key, params[key])
    })

    return api.post(REST_URL.ADD_EXTUSERRULE_DATA_BAT, forms)
  },

  getExtUserRuleDetails (params) {
    return api.post(REST_URL.QUERY_EXTUSERRULE_DATA, params)
  },

  delExtUserRule (params) {
    return api.post(REST_URL.DEL_EXTUSERRULE_DATA, params, {confirm: {}})
  }
}
