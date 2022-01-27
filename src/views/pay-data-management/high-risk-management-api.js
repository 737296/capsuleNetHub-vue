import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'
// import { downloadFile } from '@/api/common';

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_HIGH_RISK_TABLE, params)
  },

  intervene (params, {type = 'all'}) {
    if (type === 'all') {
      return api.post(REST_URL.INTERVENE_ALL, params)
    } else {
      const forms = new FormData()
      forms.append('file', params.file)
      forms.append('interventionDesc', params.interventionDesc)
      return api.post(REST_URL.INTERVENE_PART, forms)
    }
  },

  block (params) {
    return api.post(REST_URL.BLOCK, params)
  }

  // getDetails (params) {
  //   return api.post(REST_URL.QUERY_ORDER_DATA, params);
  // },

  // getRefundDetails (params) {
  //   return api.post(REST_URL.QUERY_REFUNDORDER_DATA, params);
  // },

  // exportData (params, filename = '未命名文件.xlsx') {
  //   return downloadFile(REST_URL.EXPORT_MCSTOREPAY_DATA, params, filename);
  // }
}
