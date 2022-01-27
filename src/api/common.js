import iview from 'iview'
import { api } from './index.js'
import { REST_URL } from '../utils/restUrl.js'

/**
 * 下载文件
 * @param {String} url 地址
 * @param {*} params 参数
 * @param {String} filename 文件名
 */
export const downloadUrlFile = (url, params, filename = '未命名文件') => {
  return api.get(url, {
    params
    // responseType: 'blob'
  }).then((response) => {
    // let url1 = window.location.protocol // "http:"
    // // let url2 = window.location.host // "localhost"
    // let resUrl = response.data.data
    // // let fileUrl = url1+url2+resUrl
    // let fileUrl = url1 + resUrl
    // // 下载方法
    // function downloadWithBlob (url, filename) {
    //   fetch(url).then(res => res.blob().then(blob => {
    //     var a = document.createElement('a')
    //     var url = window.URL.createObjectURL(blob)
    //     a.href = url
    //     a.download = filename
    //     a.click()
    //     window.URL.revokeObjectURL(url)
    //   }))
    // }
    // downloadWithBlob(fileUrl, filename)
    return downloadFile(response.data.data, {}, filename)
  })
}

export const downloadFile = (url, params, filename = '未命名文件') => {
  return api.get(url, {
    params,
    responseType: 'blob'
  }).then((response) => {
    // 下载方法
    const download = (blob) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = URL.createObjectURL(blob)
      // let orgFileName = ''
      // try {
      //   const contentDisposition = response.headers['content-disposition']
      //   contentDisposition && (orgFileName =decodeURI(contentDisposition.split('=')[2].split("''")[1], "UTF-8"))
      // } catch (error) {
      // }
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
      a.remove()
    }
    const blob = response.data
    // 服务器返回数据小于1k时,尝试解析数据
    if (blob.size < 1024) {
      let reader = new FileReader()
      reader.readAsText(blob, 'utf-8')
      reader.onload = function ({target}) {
        try {
          const {msg} = JSON.parse(target.result)
          iview.Message.error(`导出失败！${msg}`)
        } catch (e) {
          download(blob)
        }
      }
    } else {
      download(blob)
    }
  })
}
export default {
  queryFormMentBoxList (params) {
    return api.get(REST_URL.MENU_SELECT_MENTBOX, {params})
  },
  queryFormBrandList (params) {
    return api.get(REST_URL.FORM_BRAND_SELECT, {params})
  },
  queryFormBusinessList (params) {
    return api.get(REST_URL.FORM_BUSINESS_SELECT, {params})
  },
  queryFromBusinessAppList (params) {
    return api.get(REST_URL.FORM_BUSINESSAPP_SELECT, {params})
  },
  queryFromAppList (params) {
    return api.get(REST_URL.FORM_APP_SELECT, {params})
  },
  queryFormSignTypeList (params) {
    return api.get(REST_URL.FORM_SIGNTYPE_SELECT, {params})
  },
  queryFormPortalTypeList (params) {
    return api.get(REST_URL.FORM_PORTALTYPE_SELECT, {params})
  },
  queryFormPaymentCodeList (params) {
    return api.get(REST_URL.FORM_PAYMENTCODE_SELECT, {params})
  },
  queryFromPayTypeList (params) {
    return api.get(REST_URL.FORM_PAYTYPE_SELECT, params)
  },
  queryFromNewPayTypeList (params) {
    return api.get(REST_URL.FORM_NEW_PAYTYPE_SELECT, {params})
  },

  queryFromRoleList (params) {
    return api.get(REST_URL.FORM_ROLE_SELECT, {params})
  },

  queryMenuTree (params) {
    return api.get(REST_URL.MENU_TREE_SELECT, {params})
  },

  queryFromProductRuleList (params) {
    return Promise.resolve({data: {
      code: 200,
      data: [
        {
          code: 'no',
          name: '无限制'
        },
        {
          code: 'blocklist',
          name: '黑名单'
        }
      ]
    }})
  },

  queryFromUserRuleList (params) {
    return Promise.resolve({data: {
      code: 200,
      data: [
        {
          code: 'no',
          name: '无限制'
        },
        {
          code: 'allowlist',
          name: '白名单'
        },
        {
          code: 'blocklist',
          name: '黑名单'
        }
      ]
    }})
  },

  queryFromDepartmentRuleList (params) {
    return Promise.resolve({data: {
      code: 200,
      data: [
        {
          code: 'no',
          name: '无限制'
        },
        {
          code: 'allowlist',
          name: '白名单'
        }
      ]
    }})
  },

  queryFromOriginFromList (params) {
    return Promise.resolve({data: {
      code: 200,
      data: [
        {
          code: 1,
          name: '正向支付'
        },
        {
          code: 2,
          name: '反向退单'
        }
      ]
    }})
  },

  queryEnvironmentList (params) {
    return Promise.resolve({data: {
      code: 200,
      data: [
        {
          code: 'KS',
          name: '金山'
        },
        {
          code: 'QC',
          name: '腾讯'
        },
        {
          code: 'QCPIL',
          name: '腾讯灰灾'
        }
      ]
    }})
  }

}
