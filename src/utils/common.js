import cloneDeep from 'lodash/cloneDeep'
/**
 * 获取表格的高度
 * @param {DomObject} dom 表格的父节点dom对象
 */
export function getTableHeight (dom) {
  let parentDom = dom.parentElement
  let otherHeight = 0
  for (let childrenItem of parentDom.children) {
    if (childrenItem !== dom && !childrenItem.className.split(' ').includes('ivu-spin')) {
      otherHeight += childrenItem.offsetHeight
    }
  }
  return parentDom.clientHeight - otherHeight
}

export function toBase64 (data) {
  return new Promise((resolve, reject) => {
    if (data) {
      var reader = new FileReader()
      reader.readAsDataURL(data)
      reader.onload = function (ev) {
        resolve(ev.target.result)
      }
      reader.onerror = function (ev) {
        reject(new Error('转换失败'))
      }
    } else {
      resolve(null)
    }
  })
}

/**
 * 获取url参数
 */
export const getPathParams = () => {
  const params = {}
  const search = window.location.search
  if (search) {
    Object.assign(
      params,
      search
        .substring(1, search.length)
        .split('&')
        .filter(v => v)
        .reduce((sum, kv) => {
          const [key, val] = kv.split('=')
          key && (sum[decodeURIComponent(key)] = decodeURIComponent(val || ''))
          return sum
        }, {})
    )
  }

  return params
}

/**
 * 复制值（暂不支持复制复杂对象）
 * @param {*} target 要复制的值
 */
export const copy = cloneDeep

/**
 * 嵌套数组全遍历
 * @param {Array|Object} obj 遍历对象
 * @param {*} callbackfn
 */
export const ArrayObjectEach = (obj, callbackfn) => {
  const _ArrayObjectEach = (obj, callbackfn, parent, key, depth) => {
    if (!obj || !callbackfn) {
      return obj
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => {
        _ArrayObjectEach(v, callbackfn, parent, key, depth + 1)
      })
    } else {
      callbackfn(obj, parent, key, depth)
      Object.keys(obj).forEach((key) => {
        const filedValue = obj[key]
        if (Array.isArray(filedValue)) {
          _ArrayObjectEach(filedValue, callbackfn, obj, key, depth + 1)
        }
      })
    }
  }

  _ArrayObjectEach(obj, callbackfn, null, null, 0)
  return obj
}

const rule = {
  no: '无限制',
  allowlist: '白名单',
  blocklist: '黑名单'
}
/**
 * 获取类型
 * @param {*} type 类型
 */
export const getPayChannelRuleByType = (type) => {
  return {
    type,
    name: rule[type] || type
  }
}

const cnNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
/**
 * 阿拉伯数字转中文
 * @param {*} num 数字
 */
export const num2cnnum = (num) => {
  return cnNum[Number.parseInt(num)]
}

export const commonUtils = {
  install (Vue) {
    Vue.prototype.$copy = copy
    Vue.prototype.$ArrayObjectEach = ArrayObjectEach
  }
}
