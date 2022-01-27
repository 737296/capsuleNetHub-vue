import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_APPSECRET_TABLE, params)
  },

  updateData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_APPSECRET_DATA, params)
    } else {
      return api.post(REST_URL.ADD_APPSECRET_DATA, params)
    }
  },

  delData (params) {
    return api.post(REST_URL.DEL_APPSECRET_DATA, params, {confirm: {}})
  },

  uploadFile (file, params) {
    const forms = new FormData()
    forms.append('file', file)
    params && Object.keys(params).forEach((key) => {
      forms.append(key, params[key])
    })

    return api.post(REST_URL.UPLOAD_MERCHANT_DATA, forms)
  }
}
