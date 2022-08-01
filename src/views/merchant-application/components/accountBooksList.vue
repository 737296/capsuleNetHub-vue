<template>

  <div id="user-management"
       class="page-root">

    <page-table v-model="tableData"
                @on-table-ref="mixin_getTableRef">
      <template slot="oper">

        <Select v-model="balanceAccountType"
                style="width:200px">
          <Option v-for="item in balanceAccountTypeList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button class="oper-wrapper-button"
                shape="circle"
                size="small"
                @click="addaccountbooks()">创建账簿</Button>

      </template>
    </page-table>
    <EditPopup ref="EditPopup"></EditPopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from '../application-api'

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
  name: 'accountBooksList',
  mixins: [commMixin],
  data () {
    return {
      balanceAccountType: null,
      legalCode: null,
      tableData: {
        loading: false,
        table: {
          border: true,
          height: 0,
          columns: [
            {
              title: '电子账簿类别',
              key: 'balanceAcctType',
              align: 'center',
              minWidth: 20

            },
            {
              title: '电子账簿编号',
              key: 'balanceAcctId',
              align: 'center',
              minWidth: 20

            },
            {
              title: '银行卡号',
              key: 'merBankAccount',
              align: 'center',
              minWidth: 20

            },

            {
              title: '法人编号',
              key: 'legalCode',
              align: 'center',
              minWidth: 20

            }

          ],
          data: []
        },
        page: {
          hide: false
        }
      },
      formData: getDefFormData(),
      balanceAccountTypeList: [
        {
          value: 'MTPAY',
          label: 'MTPAY'
        },
        {
          value: 'ELEMEPAY',
          label: 'ELEMEPAY'
        },
        {
          value: 'UNIONPAY',
          label: 'UNIONPAY'
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
    this.legalCode = this.$route.params.data
    console.log('传来的数据' + this.legalCode)
    this.currentOptions = this.$copy(this.formData)
    this.mixin_queryFormStateList()
    this.mixin_queryFromRoleList()
    // this.mixin_queryFormBrandList()
    // this.mixin_queryFromPayTypeList();
    // this.mixin_queryFromAppList();
    // this.mixin_queryFormSignTypeList();
    // this.mixin_queryFormAscriptionList();
    this.queryData()
  },
  mounted () { },
  beforeDestroy () { },
  // 在该页面中引入其他页面
  components: {
    EditPopup: (resolve) => require(['./accountBooksAdd'], resolve)
  },
  methods: {
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
    // exportExcel () {
    //   const close = this.$Message.loading({
    //     content: '正在导出...',
    //     duration: 0
    //   })
    //   const param = getRealFromData(this.currentOptions)
    //   baseApi
    //     .exportData(
    //       {
    //         ...param
    //       },
    //       `神钱包_云闪付_${param.storeCode}.xlsx`
    //     )
    //     .finally(() => {
    //       close()
    //     })
    // },
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
        .queryAccountBooksList({
          // ...getRealFromData(this.currentOptions),
          'pageNum': this.tableData.page.current, // 当前页
          'pageSize': this.tableData.page.pageSize, // 每页条数
          'legalCode': this.legalCode
        })
        .then(({ data }) => {
          console.log('测试中！')
          console.log(this.currentOptions)
          if (data.code === 200 || data.code === '200') {
            // this.tableData.page.total = data.data.totalNum
            // 渲染数据
            this.tableData.table.data = data.data
            console.log(data)
          }
        })
        .catch((err) => {
          this.$Message.error('查询失败！')
          console.log('异常', err)
        })
        .finally(() => {
          this.tableData.loading = false
        })
    },

    addaccountbooks () {
      console.log('表单返回值123' + this.balanceAccountType)
      baseApi
        .addaccountbooks({
          'legalCode': this.legalCode,
          'balanceAccountType': this.balanceAccountType
        })
        .then(({ data }) => {
          if (data.code === 200 || data.code === '200') {
            // this.$Message.success('添加成功')
            this.$Notice.success({
              title: data.msg,
              duration: 3
            })
            this.queryData()
            console.log('表单返回值' + data)
          } else {
            // this.$Message.error('添加失败')
            this.$Notice.error({
              title: data.msg.issue ? data.msg.issue : data.msg,
              duration: 3
            })
          }
        })
        .catch((err) => {
          // this.$Message.error('添加异常！')
          this.$Notice.error({
            title: '异常',
            duration: 3
          })
          console.log(err)
        })
    }

  }
}
</script>

<style lang="less" scoped>
</style>
