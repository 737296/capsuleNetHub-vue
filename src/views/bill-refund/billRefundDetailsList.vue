<template>
  <div id="user-management"
       class="page-root">

    <page-table-copy v-model="tableData"
                     @on-table-ref="mixin_getTableRef">

    </page-table-copy>
    <EditPopup ref="EditPopup"></EditPopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from './application-api'
import pageTableCopy from '@/components/page-table-copy.vue'

const getDefFormData = () => ({
  legalCode: '',

  enableFlag: -1
})

// eslint-disable-next-line no-unused-vars
const getRealFromData = (formData) => {
  const res = { ...formData }
  res.enableFlag === -1 && delete res.enableFlag
  if ('enableFlag' in res) {
    res.enableFlag = res.enableFlag === 'true'
  }
  return res
}

export default {
  components: { pageTableCopy },
  name: 'applicationList',
  mixins: [commMixin],
  data () {
    return {
      dateNum: null,
      Checkamount: null,
      tableData: {
        loading: false,
        table: {
          border: true,
          height: 0,
          columns: [
            {
              type: 'index',
              title: '序号',
              align: 'center',
              minWidth: 5
            },
            {
              title: '网支号',
              key: 'paymentNum',
              align: 'center',
              minWidth: 60

            },
            {
              title: '交易号',
              key: 'transactionNum',
              align: 'center',
              minWidth: 60
            },
            {
              title: '品牌',
              key: 'brand',
              align: 'center',
              minWidth: 15

            },
            {
              title: '业务',
              key: 'business',
              align: 'center',
              minWidth: 15

            },
            {
              title: '支付渠道',
              key: 'channel',
              align: 'center',
              minWidth: 15

            },
            {
              title: '异常',
              key: 'nonRefundReason',
              align: 'center',
              minWidth: 200
            },
            {
              title: '创建时间',
              key: 'createDatenew',
              align: 'center',
              minWidth: 75
            },
            {
              title: '更新时间',
              key: 'updateDatenew',
              align: 'center',
              minWidth: 75
            },

            {
              title: '退款发起人',
              key: 'refundStaff',
              align: 'center',
              minWidth: 60
            },
            {
              title: '退款理由',
              key: 'refundReason',
              align: 'center',
              minWidth: 60
            }

          ],
          data: []
        },
        page: {
          hide: false
        }
      },
      formData: {
        legalCode: null,
        companyName: null,
        isFranchisees: null,
        applicationStatus: null,
        brandStatus: null,
        businessStatus: null,
        channelStatus: null,
        nonRefundReasonStatus: null

      },

      brandList: [
        {
          value: null,
          label: '全部'
        }
      ],
      businessList: [
        {
          value: null,
          label: '全部'
        }
      ],
      channelList: [
        {
          value: null,
          label: '全部'
        }
      ]
    }
  },
  computed: {
    roleMap () {
      return (this.srcRoleList || []).reduce((sum, val) => {
        sum[val.code] = val.name
        return sum
      }, {})
    }
  },
  created () {
    if (localStorage.getItem('brand') === null && localStorage.getItem('business') === null && localStorage.getItem('channel') === null && localStorage.getItem('nonRefundReasonStatus') === null) {
      localStorage.setItem('brand', this.$route.params.data)
      localStorage.setItem('business', this.$route.params.data1)
      localStorage.setItem('channel', this.$route.params.data2)
      localStorage.setItem('nonRefundReason', this.$route.params.data3)
      localStorage.setItem('dateNum', this.$route.params.data4)
      this.formData.brandStatus = localStorage.getItem('brand')
      this.formData.businessStatus = localStorage.getItem('business')
      this.formData.channelStatus = localStorage.getItem('channel')
      this.formData.nonRefundReasonStatus = localStorage.getItem('nonRefundReason')
      this.dateNum = localStorage.getItem('dateNum')
    } else {
      this.formData.brandStatus = localStorage.getItem('brand')
      this.formData.businessStatus = localStorage.getItem('business')
      this.formData.channelStatus = localStorage.getItem('channel')
      this.formData.nonRefundReasonStatus = localStorage.getItem('nonRefundReason')
      this.dateNum = localStorage.getItem('dateNum')
    }

    this.queryBillRefundDetailsList()
  },
  mounted () { },
  beforeDestroy () { },
  destroyed () {
    localStorage.clear()
  },
  // components: {
  //   EditPopup: (resolve) => require(['./components/user-edit-popup'], resolve)
  // },
  methods: {

    // 查询退款异常详情列表
    queryBillRefundDetailsList () {
      baseApi
        .getBillRefundList({
          brand: this.formData.brandStatus,
          business: this.formData.businessStatus,
          channel: this.formData.channelStatus,
          nonRefundReason: this.formData.nonRefundReasonStatus,
          dateNum: this.dateNum

        })
        .then(({ data }) => {
          if (data.code === 200 || data.code === '200') {
            console.log(data.data.managerBillRefundDTODetailsList)
            this.tableData.table.data = data.data.managerBillRefundDTODetailsList
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          // this.$Message.error(`操作失败！${err.message}`)
          console.log(err)
        })
    },
    showEditPopup ({ row, column, index }) {
      switch (column.key) {
        case 'reason':
        case 'add_data':
          this.$refs.EditPopup.showPopup(
            { row, column, index },
            {
              srcRoleList: this.srcRoleList,
              srcStateList: this.srcStateList,
              isEdit: column.key === 'reason',
              callback: () => {
                this.queryData()
              }
            }
          )
          break
        default:
          break
      }
    },
    delData ({ row, column, index }) {
      baseApi
        .delData({
          id: row.id
        })
        .then(({ data }) => {
          if (data.code === 200 || data.code === '200') {
            this.$Message.success(`操作成功`)
            this.queryData()
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          // this.$Message.error(`操作失败！${err.message}`)
          console.log(err)
        })
    },

    /**
* 初始化Form的默认值
*/
    resetForm () {
      this.formData = getDefFormData()
      this.mixin_resetPage()
    },
    /**
* 改变表格高度
*/
    setTableHeight (height) {
      this.tableData.table.height = height
    },
    /**
* 查询列表
*/
    queryData () {
      this.tableData.loading = true
      baseApi
        .queryTable({
          // ...getRealFromData(this.currentOptions),
          pageNum: this.tableData.page.current, // 当前页
          pageSize: this.tableData.page.pageSize, // 每页条数
          legalCode: this.formData.legalCode,
          companyName: this.formData.companyName,
          isFranchisees: this.formData.isFranchisees,
          applicationStatus: this.formData.applicationStatus

        })
        .then(({ data }) => {
          console.log('测试中！')
          console.log(this.currentOptions)
          console.log(this.tableData.page.current)
          console.log(this.tableData.page.pageSize)
          // if (data.data.records.length !== 0) {
          if (data.code === 200 || data.code === '200') {
            this.tableData.page.total = data.data.totalNum
            console.log('test')

            for (var i = 0, l = data.data.records.length; i < l; i++) {
              console.log(data.data.records[i])
              if (data.data.records[i].applicationStatus === null) {
                data.data.records[i].applicationStatus = '待创建'
              }
              if (data.data.records[i].applicationStatus === 10) {
                data.data.records[i].applicationStatus = '草稿保存'
              } if (data.data.records[i].applicationStatus === 11) {
                data.data.records[i].applicationStatus = '银联受理中'
              } if (data.data.records[i].applicationStatus === 20) {
                data.data.records[i].applicationStatus = '资料校验中'
              } if (data.data.records[i].applicationStatus === 21) {
                data.data.records[i].applicationStatus = '待账户验证'
              } if (data.data.records[i].applicationStatus === 22) {
                data.data.records[i].applicationStatus = '金额审核中'
              } if (data.data.records[i].applicationStatus === 23) {
                data.data.records[i].applicationStatus = '进件处理中'
              } if (data.data.records[i].applicationStatus === 24) {
                data.data.records[i].applicationStatus = '电子签约中'
              } if (data.data.records[i].applicationStatus === 25) {
                data.data.records[i].applicationStatus = '审核通过'
              } if (data.data.records[i].applicationStatus === 26) {
                data.data.records[i].applicationStatus = '审核驳回'
              } if (data.data.records[i].applicationStatus === 27) {
                data.data.records[i].applicationStatus = '账户冻结'
              }
            }
            // 渲染数据
            this.tableData.table.data = data.data.records
            console.log(data.data.records)
          } else {
            this.$Message.error('请求响应状态错误')
          }
          // } else {
          //   this.tableData.table.data = data.data.records
          //   this.$Message.error('没有找到法人，请确认在MC已经完成配置')
          // }
        })
        .catch((err) => {
          this.$Message.error('查询异常')
          console.log(err)
        })
        .finally(() => {
          this.tableData.loading = false
        })
    },
    // 校验金额
    Checkallamount (legalCode, Checkamount) {
      console.log('法人id', legalCode)
      console.log('校验金额', Checkamount)
      baseApi
        .Checkallamount({
          legalCode: legalCode,
          payAmount: Checkamount

        })
        .then(({ data }) => {
          console.log(JSON.stringify(data))

          if (data['code'] === 200 || data['code'] === '200') {
            // this.$Message.success(res.data['msg'])
            this.$Message.success('请求返回成功')
          }

          this.$Message.info('金额校验中')
        })
        .catch((err) => {
          console.log(JSON.stringify(err))
          this.$Message.error('请求返回异常' + err)
        })
    }
  }
}
</script>

<style lang="less" src="./application.less" scoped>
</style>
