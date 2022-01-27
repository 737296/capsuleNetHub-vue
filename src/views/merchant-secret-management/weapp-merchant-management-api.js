import { api } from '@/api'
import { downloadFile } from '@/api/common'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_WEAPPMERCHANT_TABLE, params)
  },

  updateData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_WEAPPMERCHANT_DATA, params)
    } else {
      return api.post(REST_URL.ADD_WEAPPMERCHANT_DATA, params)
    }
  },

  delData (params) {
    return api.post(REST_URL.DEL_WEAPPMERCHANT_DATA, params, {confirm: {}})
  },

  getDetails (params) {
    return api.post(REST_URL.QUERY_WEAPPMERCHANT_DATA, params)
  },

  uploadFile (file, params) {
    const forms = new FormData()
    forms.append('file', file)
    params && Object.keys(params).forEach((key) => {
      forms.append(key, params[key])
    })

    return api.post(REST_URL.UPLOAD_WEAPPMERCHANT_DATA, forms)
  },

  exportData (params, filename = '未命名文件.xlsx') {
    return downloadFile(REST_URL.EXPORT_WEAPPMERCHANT_DATA, params, filename)
  }

  // queryExtProductTable (params) {
  //   return api.post(REST_URL.QUERY_EXTPRODUCT_TABLE, params);
  // },
  // updateExtProductRule (params) {
  //   if ('id' in params) {
  //     return api.post(REST_URL.UPDATE_EXTPRODUCTRULE_DATA, params);
  //   } else {
  //     return api.post(REST_URL.ADD_EXTPRODUCTRULE_DATA, params);
  //   }
  // },
  // getExtProductRuleDetails (params) {
  //   return api.post(REST_URL.QUERY_EXTPRODUCTRULE_DATA, params);
  // },
  // delExtProductRule (params) {
  //   return api.post(REST_URL.DEL_EXTPRODUCTRULE_DATA, params);
  // },

  // queryExtUserTable (params) {
  //   return api.post(REST_URL.QUERY_EXTUSER_TABLE, params);
  // },
  // updateExtUserRule  (params) {
  //   if ('id' in params) {
  //     return api.post(REST_URL.UPDATE_EXTUSERRULE_DATA, params);
  //   } else {
  //     return api.post(REST_URL.ADD_EXTUSERRULE_DATA, params);
  //   }
  // },

  // getExtUserRuleDetails (params) {
  //   return api.post(REST_URL.QUERY_EXTUSERRULE_DATA, params);
  // },

  // delExtUserRule (params) {
  //   return api.post(REST_URL.DEL_EXTUSERRULE_DATA, params);
  // }
}
