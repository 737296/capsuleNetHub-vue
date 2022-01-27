import debounce from 'lodash/debounce'
import defaultsDeep from 'lodash/defaultsDeep'
// import { mapState, mapActions } from 'vuex';
import baseApi from '@/api/common'

const getSelAll = () => ({
  code: -1,
  name: '全部'
})
const getSelText = () => ({
  code: -1,
  name: '未选择'
})

export default {
  data () {
    return {
      /**
       * 货劳
       */
      mentBoxList: [getSelAll()],
      srcMentBoxList: [],
      /**
       * 品牌
       */
      brandList: [getSelAll()],
      srcBrandList: [],
      /**
       * 业务
       */
      businessList: [getSelAll()],
      srcBusinessList: [],
      /**
       * 支付方式
       */
      payTypeList: [getSelAll()],
      srcPayTypeList: [],
      /**
       * 支付方式  new
       */
      payNewTypeList: [getSelAll()],
      srcPayNewTypeList: [],
      /**
       * 用户规则
       */
      userRuleList: [],
      srcUserRuleList: [],
      /**
       * 商品规则
       */
      productRuleList: [],
      srcProductRuleList: [],
      // 货劳规则
      departmentRuleList: [],
      srcDepartmentRuleList: [],
      /**
       * 签名方式
       */
      signTypeList: [getSelAll()],
      srcSignTypeList: [],
      /**
       * 终端类型
       */
      portalTypeList: [getSelAll()],
      srcPortalTypeList: [],
      /**
       * 支付产品code
       */
      paymentCodeList: [getSelAll()],
      srcPaymentCodeList: [],
      /**
       * 业务APP列表
       */
      businessAppList: [getSelAll()],
      srcBusinessAppList: [],

      /**
       * app列表
       */
      appList: [getSelAll()],
      srcAppList: [],

      roleList: [getSelAll()],
      srcRoleList: [],

      /**
       * 异常支付来源
       */
      srcFromOriginFromList: [],
      fromOriginFromList: [],

      /**
       * 环境列表
       */
      srcEnvironmentList: [],
      environmentList: [],

      /**
       * 直营加盟
       */
      storeAscription: [getSelAll()],
      srcStoreAscriptionList: [],

      /**
       * 启用禁用
       */
      stateList: [getSelAll()],
      srcStateList: [],

      /**
       * 菜单树
       */
      srcMenuTree: [],

      currentOptions: {},
      tableData: {
        page: {
          hide: true,
          current: 1,
          pageSize: 10,
          showElevator: true,
          showSizer: true,
          on: {}
        }
      }
    }
  },
  created () {
    defaultsDeep(this.tableData.page.on, {
      'on-change': this.mixin_changeCurrentPageIndex,
      'on-page-size-change': this.mixin_changePageSize
    })
  },
  methods: {
    mixin_getUnrepeatedList (list) {
      const map = {}
      return (list || []).filter((it) => {
        const retain = !map[it.code]
        map[it.code] = it.code
        return retain
      })
    },
    mixin_findBusinessListByBrandCode (code, businessList = this.businessList) {
      let res = businessList
      if (code && code !== -1 && businessList) {
        res = businessList.filter(({ brandCode }) => !brandCode || brandCode === code)
      }
      return this.mixin_getUnrepeatedList(res)
    },
    mixin_getBusinessAppByOptions ({ businessCode, brandCode }, businessAppList = this.businessAppList) {
      let res = businessAppList
      businessCode === -1 && (businessCode = '')
      brandCode === -1 && (brandCode = '')
      if (businessAppList) {
        res = businessAppList.filter(({ businessCode: busCode, brandCode: bCode }) => (!brandCode || brandCode === bCode) && (!businessCode || businessCode === busCode))
      }
      return this.mixin_getUnrepeatedList(res)
    },
    mixin_findPayTypeListByPortalTypeAndPaymentCode ({ portalType, paymentCode, payTypeList = this.payTypeList }) {
      let res = payTypeList
      portalType === -1 && (portalType = '')
      paymentCode === -1 && (paymentCode = '')
      if (payTypeList) {
        res = payTypeList.filter(({ portalType: pt, productCode: pc }) => (!pt || pt === portalType) && (!pc || pc === paymentCode))
      }

      return this.mixin_getUnrepeatedList(res)
    },
    mixin_getTableRef (ref) {
      if (ref) {
        this.mixin_pageTableRef = ref
        this.mixin_calculateTableHeight()
        window.addEventListener('resize', this.mixin_calculateTableHeight)
      } else {
        window.removeEventListener('resize', this.mixin_calculateTableHeight)
      }
    },
    mixin_resetPage () {
      this.tableData.page.current = 1
      this.tableData.page.pageSize = 10
    },
    mixin_calculateTableHeight () {
      // this.setTableHeight(getTableHeight(this.mixin_pageTableRef.$el) || 0)
    },
    mixin_queryData: debounce(function () {
      this.queryData()
    }, 200),
    /**
     * 改变当前页码
     * @param {Number} index 第几页
     */
    mixin_changeCurrentPageIndex (index) {
      this.tableData.page.current = index
      this.mixin_queryData()
    },
    /**
     * 改变一页的条数
     * @param {Number} num 第几页
     */
    mixin_changePageSize (num) {
      this.tableData.page.pageSize = num
      this.mixin_queryData()
    },
    // 各种下拉列表
    mixin_queryFormBrandList (params) {
      return baseApi.queryFormBrandList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcBrandList = data.data.map(({code, ...prds}) => ({...prds, code, name: code}))
          this.brandList = [getSelAll(), ...this.srcBrandList]
        }
      })
    },
    mixin_queryMentBoxList (params) {
      return baseApi.queryFormMentBoxList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcMentBoxList = data.data.map(({code, name, ...prds}) => ({...prds, code: code, name: `${code} （${name}）`}))
          // this.srcMentBoxList = [getSelText(), ...this.srcMentBoxList]
          this.mentBoxList = [getSelText(), ...this.srcMentBoxList]
        }
      })
    },
    mixin_queryFormBusinessList (params) {
      return baseApi.queryFormBusinessList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcBusinessList = data.data.map(({code, ...prds}) => ({...prds, code, name: code}))
          this.businessList = [getSelAll(), ...this.srcBusinessList]
        }
      })
    },
    mixin_queryEnvironmentList (params) {
      return baseApi.queryEnvironmentList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcEnvironmentList = data.data
          this.environmentList = [getSelAll(), ...this.srcEnvironmentList]
        }
      })
    },
    mixin_queryFormSignTypeList (params) {
      return baseApi.queryFormSignTypeList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcSignTypeList = data.data.map((v) => {
            return {
              code: v,
              name: v
            }
          })
          this.signTypeList = [getSelAll(), ...this.srcSignTypeList]
        }
      })
    },
    mixin_queryFormPortalTypeList (params) {
      return baseApi.queryFormPortalTypeList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcPortalTypeList = data.data
          this.portalTypeList = [getSelAll(), ...this.srcPortalTypeList]
        }
      })
    },
    mixin_queryFormPaymentCodeList (params) {
      return baseApi.queryFormPaymentCodeList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcPaymentCodeList = data.data
          this.paymentCodeList = [getSelAll(), ...this.srcPaymentCodeList]
        }
      })
    },
    mixin_queryFromPayTypeList (params) {
      return baseApi.queryFromPayTypeList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcPayTypeList = data.data
          this.payTypeList = [getSelAll(), ...this.srcPayTypeList]
        }
      })
    },
    mixin_queryFromNewPayTypeList (params) {
      return baseApi.queryFromNewPayTypeList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcPayTypeList = data.data
          this.payTypeList = [getSelAll(), ...this.srcPayTypeList]
        }
      })
    },
    mixin_queryFromProductRuleList (params) {
      return baseApi.queryFromProductRuleList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcProductRuleList = data.data
          this.productRuleList = [getSelAll(), ...this.srcProductRuleList]
        }
      })
    },
    mixin_queryFromUserRuleList (params) {
      return baseApi.queryFromUserRuleList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcUserRuleList = data.data
          this.userRuleList = [getSelAll(), ...this.srcUserRuleList]
        }
      })
    },
    mixin_queryFromDepartmentRuleList (params) {
      return baseApi.queryFromDepartmentRuleList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcDepartmentRuleList = data.data
          this.departmentRuleList = [getSelAll(), ...this.srcDepartmentRuleList]
        }
      })
    },
    mixin_queryFormBusinessAppList (params) {
      return baseApi.queryFromBusinessAppList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcBusinessAppList = data.data
          this.businessAppList = [getSelAll(), ...this.srcBusinessAppList]
        }
      })
    },
    mixin_queryFromOriginFromList (params) {
      return baseApi.queryFromOriginFromList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcFromOriginFromList = data.data
          this.fromOriginFromList = [getSelAll(), ...this.srcFromOriginFromList]
        }
      })
    },
    mixin_queryFromAppList (params) {
      return baseApi.queryFromAppList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcAppList = data.data.map((v) => {
            return {
              code: v,
              name: v
            }
          })
          this.appList = [getSelAll(), ...this.srcAppList]
        }
      })
    },
    mixin_queryFromRoleList (params) {
      return baseApi.queryFromRoleList(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcRoleList = data.data
          this.roleList = [getSelAll(), ...this.srcRoleList]
        }
      })
    },
    mixin_queryMenuTree (params) {
      return baseApi.queryMenuTree(params).then(({ data }) => {
        if (data.code === 200) {
          this.srcMenuTree = this.$ArrayObjectEach(data.data, (node, parent, key, depth) => {
            node.title = node.name
            node.expand = true
          })
        }
      })
    },
    mixin_queryFormAscriptionList () {
      this.srcStoreAscriptionList = [
        {
          code: 'false',
          name: '直营'
        },
        {
          code: 'true',
          name: '加盟'
        }
      ]
      this.storeAscriptionList = [getSelAll(), ...this.srcStoreAscriptionList]
      return Promise.resolve()
    },
    mixin_queryFormStateList () {
      this.srcStateList = [
        {
          name: '启用',
          code: 'true'
        },
        {
          name: '禁用',
          code: 'false'
        }
      ]
      this.stateList = [getSelAll(), ...this.srcStateList]
      return Promise.resolve()
    }
  }
}
