<template>
  <div id="alipay-merchant-management" class="page-root">
    <div class="form-box">
      <Form ref="formData" :model="formData" :label-width="96">
        <FormItem prop="merchantNo" label="账号UID：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.merchantNo"
            placeholder="输入账号UID"
          />
        </FormItem>
        <FormItem prop="companyName" label="法人公司名：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.companyName"
            placeholder="输入法人公司名"
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
            <Button
              class="oper-wrapper-button"
              shape="circle"
              size="small"
              @click="showEditPopup({ column: { key: 'add_data' } })"
              >添加</Button
            >
          </div>
          <div>
            <Button
              class="oper-wrapper-button"
              shape="circle"
              size="small"
              @click="exportExcel()"
              >结果导出</Button
            >
          </div>
        </div>
      </template>
    </page-table>
    <EditPopup ref="EditPopup"></EditPopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from './alipay-merchant-management-api'

const getDefFormData = () => ({
  merchantNo: '',
  companyName: '',
  channel: 'ALIPAY'
})

const getRealFromData = (formData) => {
  const res = { ...formData }
  return res
}

export default {
  name: 'alipayMerchantManagement',
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
              title: '账号UID',
              key: 'merchantNo',
              // align: 'center',
              minWidth: 150

            },
            {
              title: '支付宝账号',
              key: 'merchantAccount',
              // align: 'center',
              minWidth: 150

            },
            {
              title: '法人公司名称',
              key: 'companyName',
              // align: 'center',
              minWidth: 150

            },
            {
              title: '归属',
              key: 'isFranchisees',
              // align: 'center',
              width: 60,

              render: (h, { row, column }) => {
                return h('span', {}, row[column.key] ? '加盟' : '直营')
              }
            },
            {
              title: '签名方式',
              key: 'signType',
              // align: 'center',
              width: 60

            },
            {
              title: '商户私钥',
              key: 'privateKey',
              // align: 'center',
              ellipsis: true

            },
            {
              title: '支付公钥',
              key: 'publicKey',
              // align: 'center',
              ellipsis: true

            },
            {
              title: '品牌',
              key: 'brand',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '操作',
              key: 'reason',
              // align: 'center',
              width: 70,
              render: (h, params) => {
                return [
                  h(
                    'a',
                    {
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          // 显示编辑弹窗
                          this.showEditPopup(params)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'a',
                    {
                      on: {
                        click: () => {
                          // 删除
                          this.delData(params)
                        }
                      }
                    },
                    '删除'
                  )
                ]
              }
            }
          ],
          data: []
        },
        page: {
          hide: false
        }
      },
      formData: getDefFormData()
    }
  },
  created () {
    this.currentOptions = this.$copy(this.formData)
    this.mixin_queryFormBrandList()
    this.mixin_queryFromPayTypeList()
    this.mixin_queryFromAppList()
    this.mixin_queryFormSignTypeList()
    // this.mixin_queryFromProductRuleList();
    // this.mixin_queryFromUserRuleList();
    // this.mixin_queryFormBusinessList();
    // this.mixin_queryFromBusinessAppList();
    this.queryData()
  },
  mounted () {},
  beforeDestroy () {},
  components: {
    EditPopup: (resolve) => require(['./components/alipay-edit-popup'], resolve)
  },
  methods: {
    showEditPopup ({ row, column, index }) {
      switch (column.key) {
        case 'reason':
        case 'add_data':
          this.$refs.EditPopup.showPopup(
            { row, column, index },
            {
              srcBrandList: this.srcBrandList,
              srcPayTypeList: this.srcPayTypeList,
              srcSignTypeList: this.srcSignTypeList,
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
          `支付宝商户列表.xlsx`
        )
        .finally(() => {
          close()
        })
    }
  }
}
</script>

<style lang="less" src="./alipay-merchant-management.less" scoped>
</style>
