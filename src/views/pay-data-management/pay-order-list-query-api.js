import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'
import { downloadFile } from '@/api/common'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_PAY_ORDER_TABLE, params)
  },

  getDetails (params) {
    return api.post(REST_URL.QUERY_ORDER_DATA, params)
  },

  getOrderApply (params) {
    return api.post(REST_URL.QUERY_REFUND_APPLY_DATA, params)
  },

  getRefundDetails (params) {
    return api.post(REST_URL.QUERY_REFUNDORDER_DATA, params)
  },

  getOrderDetailsData (params) {
    return api.post(REST_URL.QUERY_ORDER_DETAILS_DATA, params)
  },

  exportData (params, filename = '未命名文件.xlsx') {
    return downloadFile(REST_URL.EXPORT_MCSTOREPAY_DATA, params, filename)
  }
}
