<template>
  <div id="vpay-unionpay-management" class="page-root">
    <div class="form-box">
      <Form ref="formData" :model="formData" :label-width="96">
        <FormItem prop="brand" label="品牌：" class="cal-from-item">
          <Select v-model="formData.brand">
            <Option
              :value="item.code"
              v-for="item in brandList"
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
            placeholder="输入订单编号"
          />
        </FormItem>
        <FormItem prop="storeCode" label="餐厅编码：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.storeCode"
            placeholder="输入餐厅编码"
          />
        </FormItem>
        <FormItem prop="paymentNum" label="网支号：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.paymentNum"
            placeholder="输入网支号"
          />
        </FormItem>
        <FormItem prop="mobile" label="用户手机号：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.mobile"
            placeholder="输入用户手机号"
          />
        </FormItem>
        <FormItem prop="business" label="订单时间：" class="cal-from-item">
          <DatePicker
            :value="formData.daterange"
            @on-change="(daterange) => (formData.daterange = daterange)"
            format="yyyy/MM/dd HH:mm:ss"
            type="datetimerange"
            placement="bottom-end"
            placeholder="选择时间范围"
            style="width: 100%"
          ></DatePicker>
        </FormItem>
        <FormItem prop="userCode" label="用户Code：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.userCode"
            placeholder="输入用户Code"
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
        <Icon type="information-circled" class="oper-wrapper-icon" />
        <span v-if="tableData.page.total">
          共查询到 {{ tableData.page.total }} 条数据
        </span>
      </template>
    </page-table>
    <!-- <EditPopup ref="EditPopup"></EditPopup> -->
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from './pay-order-list-api'
const getDefFormData = () => ({
  brand: -1,
  transactionNum: '',
  orderId: '',
  storeCode: '',
  paymentNum: '',
  mobile: '',
  daterange: ['', ''],
  userCode: ''
})

const getRealFromData = (formData) => {
  const toFormatDate = (str) => str.replace(/\//g, '-')
  const res = { ...formData }
  res.brand === -1 && delete res.brand
  const daterange = res.daterange
  delete res.daterange
  if (daterange) {
    const [startTime, endTime] = daterange || []
    startTime && (res.startTime = toFormatDate(startTime))
    endTime && (res.endTime = toFormatDate(endTime))
  }
  return res
}

export default {
  name: 'payOrderList',
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
              title: '业务编码',
              key: 'business',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '餐厅编码',
              key: 'storeCode',
              // align: 'center',
              minWidth: 90

            },
            {
              title: '订单金额',
              key: 'orderAmount',
              // align: 'center',
              minWidth: 60

            },
            {
              title: '用户Code',
              key: 'userCode',
              // align: 'center',
              minWidth: 60
            },
            {
              title: '订单时间',
              key: 'orderTime',
              // align: 'center',
              width: 130

            },
            {
              title: '手机号',
              key: 'mobile',
              // align: 'center',
              width: 100

            },
            {
              title: '订单状态',
              key: 'orderStatus',
              // align: 'center',
              minWidth: 60

            },
            // {
            //   title: '网支号',
            //   key: 'paymentNum',
            //   // align: 'center',
            //   minWidth: 60,
            //   ellipsis: true

            // },
            {
              title: '操作',
              key: 'reason',
              // align: 'center',
              width: 70,
              render: (h, { row }) => {
                return [
                  h(
                    'a',
                    {
                      on: {
                        click: () => {
                          // 显示编辑弹窗
                          this.$router.push({
                            name: 'payOrderDetails',
                            query: {
                              orderId: row.orderId,
                              transactionNum: row.transactionNum
                            }
                          })
                        }
                      }
                    },
                    '详情'
                  )
                ]
              }
            }
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
    this.mixin_queryFormBrandList()
    // this.mixin_queryFromPayTypeList();
    // this.mixin_queryFromAppList();
    // this.mixin_queryFormSignTypeList();
    // this.mixin_queryFormAscriptionList();
    // this.queryData()
    // let data1 = this.getM()
    // let data2 = this.getM(1)
    // this.formData.daterange = [data1, data2]
  },
  mounted () {},
  beforeDestroy () {},
  components: {
    // EditPopup: (resolve) => require(["./components/edit-popup"], resolve),
  },
  methods: {
    // getM (num) {
    //   let myDate = new Date()
    //   let year = myDate.getFullYear()
    //   let month = myDate.getMonth() + 1

    //   let day = myDate.getDate()
    //   month = this.twoDigits(month)
    //   day = this.twoDigits(day)
    //   if (num) {
    //     day = Number(day) + Number(num)
    //   }
    //   let dataws = year + '/' + month + '/' + day
    //   return `${dataws} 00:00:00`
    // },
    // twoDigits (val) {
    //   if (val < 10) return '0' + val
    //   return val
    // },
    // showEditPopup({ row, column, index }) {
    //   switch (column.key) {
    //     case "reason":
    //     case "add_data":
    //       this.$refs.EditPopup.showPopup(
    //         { row, column, index },
    //         {
    //           srcBrandList: this.srcBrandList,
    //           srcPayTypeList: this.srcPayTypeList,
    //           srcSignTypeList: this.srcSignTypeList,
    //           isEdit: column.key === "reason",
    //           callback: () => {
    //             this.queryData();
    //           },
    //         }
    //       );
    //       break;
    //     default:
    //       break;
    //   }
    // },
    // delData({ row, column, index }) {
    //   baseApi
    //     .delData({
    //       id: row.id,
    //     })
    //     .then(({ data }) => {
    //       if (data.code === 200) {
    //         this.$Message.success(`操作成功`);
    //         this.queryData();
    //       } else {
    //         return Promise.reject(new Error(data.msg));
    //       }
    //     })
    //     .catch((err) => {
    //       this.$Message.error(`操作失败！${err.message}`);
    //       console.log(err);
    //     });
    // },
    // exportExcel() {
    //   const close = this.$Message.loading({
    //     content: "正在导出...",
    //     duration: 0,
    //   });
    //   const param = getRealFromData(this.currentOptions);
    //   baseApi
    //     .exportData(
    //       {
    //         ...param,
    //       },
    //       `神钱包_云闪付_${param.storeCode}.xlsx`
    //     )
    //     .finally(() => {
    //       close();
    //     });
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
      const {transactionNum, orderId, storeCode, paymentNum, mobile, userCode} = getRealFromData(this.currentOptions)
      const { brand, daterange } = this.currentOptions
      if (brand === -1 && !transactionNum && !orderId && !paymentNum && !storeCode && !mobile && !userCode && !daterange[0] && !daterange[1]) {
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

<style lang="less" src="./pay-order-list.less" scoped>
</style>
