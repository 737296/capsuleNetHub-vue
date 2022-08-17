import { api } from '@/api'
import { REST_URL } from '@/utils/restUrl.js'

export default {

  queryTable (params) {
    return api.post(REST_URL.QUERY_SHARE_DATA_LIST, params)
  }
}
