import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'
import { downloadFile, downloadUrlFile } from '@/api/common'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_MCSTOREPAY_TABLE, params)
  },

  getStoreExtInfo (params) {
    return api.get(REST_URL.QUERY_STORE_EXTINFO, {params})
  },

  updateStoreExtInfo (params) {
    return api.post(REST_URL.UPDATE_STORE_EXTINFO, params)
  },

  exportTemplate (params, filename = '未命名文件.xlsx') {
    return downloadUrlFile(REST_URL.EXPORT_MCSTOREPAY_TEMPLATE, params, filename)
  },

  uploadStoreExtInfo (params) {
    const forms = new FormData()
    Object.keys(params).forEach((key) => {
      forms.append(key, params[key])
    })
    return api.post(REST_URL.UPLOAD_MCSTOREPAY_FILE, forms)
  },

  exportData (params, filename = '未命名文件.xlsx') {
    return downloadFile(REST_URL.EXPORT_MCSTOREPAY_DATA, params, filename)
  }
}
