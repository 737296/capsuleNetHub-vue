<template>
  <div id="vpay-unionpay-management" class="page-root">
    <div class="form-box">
      <Form ref="formData" :model="formData" :label-width="96">
        <FormItem prop="merchantNum" label="商户号：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.merchantNum"
            placeholder="输入商户号"
          />
        </FormItem>
        <FormItem prop="applicationStatus"
                  label="渠道："
                  class="cal-from-item">
          <Select v-model="formData.channel"
                  style="width: 200px">
            <Option v-for="item in channelList"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
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
import baseApi from './share-data-list-api.js'
const getDefFormData = () => ({
  merchantNum: '',
  channel: null
})

export default {
  name: 'exceptionShareDataList',
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
              align: 'center',
              width: 50

            },
            {
              title: '渠道',
              key: 'channel',
              align: 'center',
              width: 80

            },
            {
              title: '商户号',
              key: 'merchantNum',
              align: 'center',
              width: 140

            },
            {
              title: '分账接收方',
              key: 'receiverAccount',
              align: 'center',
              width: 140

            },
            {
              title: '业务',
              key: 'business',
              align: 'center',
              width: 100

            },
            {
              title: '门店编码',
              key: 'storeCode',
              align: 'center',
              width: 100

            },
            {
              title: 'appId',
              key: 'appId',
              align: 'center',
              width: 150
            },
            {
              title: '描述',
              key: 'message',
              //   align: 'center',
              minWidth: 200

            }
            // {
            //   title: '操作',
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
            //               this.$router.push({
            //                 name: 'payOrderDetails',
            //                 query: {
            //                   orderId: row.orderId,
            //                   transactionNum: row.transactionNum
            //                 }
            //               })
            //             }
            //           }
            //         },
            //         '详情'
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
      formData: {
        merchantNum: '',
        channel: ''
      },
      channelList: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 'WXPAY',
          label: '微信'
        },
        {
          value: 'ALIPAY',
          label: '支付宝'
        }

      ]
    }
  },
  created () {
    this.currentOptions = this.$copy(this.formData)
  },
  mounted () {},
  beforeDestroy () {},
  components: {
    // EditPopup: (resolve) => require(["./components/edit-popup"], resolve),
  },
  methods: {
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
          merchantNum: this.formData.merchantNum,
          channel: this.formData.channel,
          pageNum: this.tableData.page.current, // 当前页
          pageSize: this.tableData.page.pageSize // 每页条数
        })
        .then(({ data }) => {
          console.log(data)
          if (data.code === 200 || data.code === '200') {
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

<style lang="less" src="./share-data-list.less" scoped>
</style>
