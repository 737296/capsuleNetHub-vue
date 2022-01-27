import { api } from '@/api'
import { downloadFile } from '@/api/common'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_ALIPAYMERCHANT_TABLE, params)
  },

  updateData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_ALIPAYMERCHANT_DATA, params)
    } else {
      return api.post(REST_URL.ADD_ALIPAYMERCHANT_DATA, params)
    }
  },

  delData (params) {
    return api.post(REST_URL.DEL_ALIPAYMERCHANT_DATA, params, {confirm: {}})
  },

  getDetails (params) {
    return api.post(REST_URL.QUERY_ALIPAYMERCHANT_DATA, params)
  },

  exportData (params, filename = '未命名文件.xlsx') {
    return downloadFile(REST_URL.EXPORT_ALIPAYMERCHANT_DATA, params, filename)
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
