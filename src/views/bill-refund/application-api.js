import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_APPLICATION_LIST, params)
  },

  updateData (params, { isEdit }) {
    if (isEdit) {
      return api.post(REST_URL.UPDATE_USER_DATA, params)
    } else {
      return api.post(REST_URL.ADD_USER_DATA, params)
    }
  },

  delData (params) {
    return api.post(REST_URL.DEL_USER_DATA, params, { confirm: {} })
  },
  addBusinesslicense (params) {
    return api.post(REST_URL.ADD_Businesslicense, params)
  },
  addformtest (params) {
    return api.post(REST_URL.addformtest, params)
  },
  addAllformtest (params) {
    return api.post(REST_URL.addAllformtest, params)
  },
  queryAccountBooksList (params) {
    return api.post(REST_URL.QUERY_ACCOUNTBOOKS_LIST, params)
  },
  addaccountbooks (params) {
    return api.post(REST_URL.addaccountbooks, params)
  },
  queryMerchantDetail (params) {
    return api.post(REST_URL.queryMerchantDetail, params)
  },
  Checkallamount (params) {
    return api.post(REST_URL.Checkallamount, params)
  },
  getBillRefundList (params) {
    return api.post(REST_URL.GET_BILL_REFUND_LIST, params)
  }

}
