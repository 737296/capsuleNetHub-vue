<template>
  <div id="pay-abnormal-list" class="page-root">
    <div class="form-box">
      <Form ref="originFrom" :model="formData" :label-width="96">
        <FormItem prop="originFrom" label="异常来源：" class="cal-from-item">
          <Select v-model="formData.originFrom">
            <Option
              :value="item.code"
              v-for="item in fromOriginFromList"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="business" label="业务渠道：" class="cal-from-item">
          <Select v-model="formData.business">
            <Option
              :value="item.code"
              v-for="item in businessList"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="transactionNum" label="交易号：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.transactionNum"
            placeholder="输入交易号"
          />
        </FormItem>
        <FormItem prop="orderId" label="订单编号：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.orderId"
            placeholder="输入交易号"
          />
        </FormItem>
        <FormItem prop="paymentNum" label="网支号：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.paymentNum"
            placeholder="输入交易号"
          />
        </FormItem>
        <div class="button-grounp">
          <Button
            size="large"
            type="primary"
            @click="
              currentOptions = $copy(formData);
              queryData();
            "
            >查询</Button
          >
          <Button size="large" @click="resetForm">清空</Button>
        </div>
      </Form>
    </div>
    <page-table v-model="tableData" @on-table-ref="mixin_getTableRef">
      <template slot="oper">
        <div class="table-oper">
          <div>
            <Icon type="information-circled" class="oper-wrapper-icon" />
            <span v-if="tableData.page.total">
              共查询到 {{ tableData.page.total }} 条数据
            </span>
          </div>
          <div>
          <Button
            class="oper-wrapper-button"
            shape="circle"
            size="small"
            @click="showBlockPopup({ column: { key: 'add_data' } })"
            >阻断缓存刷新</Button
          >
          <Button
            class="oper-wrapper-button"
            shape="circle"
            size="small"
            @click="showIntervenePopup({ column: { key: 'add_data' } })"
            >退单风控干预</Button
          >
          </div>
        </div>
      </template>
    </page-table>
    <!-- 阻断弹窗 -->
    <BlockPopup ref="BlockPopup"></BlockPopup>
    <!-- 干预弹窗 -->
    <IntervenePopup ref="IntervenePopup"></IntervenePopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from './pay-abnormal-list-api'

const getDefFormData = () => ({
  originFrom: -1,
  business: -1,
  transactionNum: '',
  orderId: '',
  paymentNum: ''
})

const getRealFromData = (formData) => {
  const res = { ...formData }
  res.business === -1 && delete res.business
  res.originFrom === -1 && delete res.originFrom
  return res
}

export default {
  name: 'payAbnormalList',
  mixins: [commMixin],
  data () {
    return {
      tableData: {
        loading: false,
        table: {
          border: true,
          height: 0,
          columns: [
            {
              type: 'index',
              title: '序号',
              // align: 'center',
              width: 60

            },
            {
              title: '交易号',
              key: 'transactionNum',
              // align: 'center',
              minWidth: 150

            },
            {
              title: '订单编号',
              key: 'orderId',
              // align: 'center',
              minWidth: 130

            },
            {
              title: '业务渠道',
              key: 'business',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '网支号',
              key: 'paymentNum',
              // align: 'center',
              minWidth: 150

            },
            {
              title: '异常描述',
              key: 'exceptionReason',
              // align: 'center',
              minWidth: 150

            },
            // {
            //   title: '干预标识',
            //   key: 'interventionFlag',
            //   // align: 'center',
            //   minWidth: 100,

            //   render: (h, { row, column }) => {
            //     return h(
            //       'span',
            //       {},
            //       row[column.key] === '1' ? '允许退单' : '未干预'
            //     )
            //   }
            // },
            {
              title: '干预标识',
              key: 'interventionFlag',
              // align: 'center',
              minWidth: 100
            },
            {
              title: '干预时间',
              key: 'interventionTime',
              // align: 'center',
              minWidth: 130

            },
            {
              title: '干预说明',
              key: 'interventionDesc',
              // align: 'center',
              minWidth: 100,
              ellipsis: true

            },
            {
              title: '异常来源',
              key: 'originFrom',
              // align: 'center',
              minWidth: 100
            },

            {
              title: 'OCC撤销时间',
              key: 'occRefundTime',
              // align: 'center',
              minWidth: 130

            },
            {
              title: 'OH关单时间',
              key: 'ohCloseTime',
              // align: 'center',
              minWidth: 130

            },
            {
              title: '自动冲销时间',
              key: 'autoRevokeTime',
              // align: 'center',
              minWidth: 130

            },
            {
              title: '业务方查询时间',
              key: 'busQueryTime',
              // align: 'center',
              minWidth: 130

            }
            // {
            //   title: '退单干预',
            //   key: 'reason',
            //   // align: 'center',
            //   width: 70,
            //   render: (h, { row }) => {
            //     return [
            //       h(
            //         'a',
            //         {
            //           on: {
            //             click: () => {
            //               // 显示编辑弹窗
            //               // this.$router.push({
            //               //   name: "payOrderDetails",
            //               //   query: {
            //               //     orderId: row.orderId,
            //               //     transactionNum: row.transactionNum,
            //               //   },
            //               // });
            //             }
            //           }
            //         },
            //         '未完成'
            //       )
            //     ]
            //   }
            // }
          ],
          data: []
        },
        page: {
          total: null,
          hide: false
        }
      },
      formData: getDefFormData()
    }
  },
  created () {
    this.currentOptions = this.$copy(this.formData)
    this.mixin_queryFormBusinessList()
    this.mixin_queryFromOriginFromList()
    this.mixin_queryEnvironmentList()
    // this.mixin_queryFormBrandList();
    // this.mixin_queryFromPayTypeList();
    // this.mixin_queryFromAppList();
    // this.mixin_queryFormSignTypeList();
    // this.mixin_queryFormAscriptionList();
    // this.queryData()
  },
  mounted () {},
  beforeDestroy () {},
  components: {
    IntervenePopup: (resolve) => require(['./components/intervene-popup'], resolve),
    BlockPopup: (resolve) => require(['./components/block-popup'], resolve)
  },
  methods: {
    showIntervenePopup ({ row, column, index }) {
      switch (column.key) {
        case 'reason':
        case 'add_data':
          this.$refs.IntervenePopup.showPopup(
            { row, column, index },
            {
              srcBusinessList: this.srcBusinessList,
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
    showBlockPopup ({ row, column, index }) {
      switch (column.key) {
        case 'reason':
        case 'add_data':
          this.$refs.BlockPopup.showPopup(
            { row, column, index },
            {
              srcBusinessList: this.srcBusinessList,
              srcEnvironmentList: this.srcEnvironmentList,
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
          if (data.code === 200) {
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
    exportExcel () {
      const close = this.$Message.loading({
        content: '正在导出...',
        duration: 0
      })
      const param = getRealFromData(this.currentOptions)
      baseApi
        .exportData(
          {
            ...param
          },
          `神钱包_云闪付_${param.storeCode}.xlsx`
        )
        .finally(() => {
          close()
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
      const {transactionNum, orderId, paymentNum} = getRealFromData(this.currentOptions)
      const {originFrom, business} = this.currentOptions
      if (originFrom === -1 && business === -1 && !transactionNum && !orderId && !paymentNum) {
        this.tableData.loading = false
        return this.$Message.error(`请输入查询条件！`)
      }
      baseApi
        .queryTable({
          ...getRealFromData(this.currentOptions),
          pageNum: this.tableData.page.current, // 当前页
          pageSize: this.tableData.page.pageSize // 每页条数
        })
        .then(({ data }) => {
          if (data.code === 200) {
            this.tableData.page.total = data.data.totalNum
            this.tableData.table.data = data.data.records
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.tableData.loading = false
        })
    }
  }
}
</script>

<style lang="less" src="./pay-abnormal-list.less" scoped>
</style>
