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
        <FormItem prop="storeCode" label="餐厅编码：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.storeCode"
            placeholder="输入餐厅编码"
          />
        </FormItem>
        <FormItem prop="isFranchisees" label="餐厅类型：" class="cal-from-item">
          <Select v-model="formData.isFranchisees">
            <Option
              :value="item.code"
              v-for="item in storeAscriptionList"
              :key="item.code"
              >{{ item.name }}</Option
            >
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
            >查询</Button>
          <Button size="large" @click="resetForm">清空</Button>
        </div>
      </Form>
    </div>
    <page-table v-model="tableData" @on-table-ref="mixin_getTableRef">
      <template slot="oper">
        <div class="table-oper" >
          <div >
            <Icon type="information-circled" class="oper-wrapper-icon" />
            <Button
              class="oper-wrapper-button"
              shape="circle"
              size="small"
              @click="exportExcel"
            >
              餐厅报告导出
            </Button>
          </div>
          <div>
            <a v-if="mbOff" class="table-text" @click="downloadTemplate">模板下载</a>
          <Button
            v-if="ctOff"
            class="oper-wrapper-button"
            shape="circle"
            size="small"
            @click="showImportPopup()"
            >餐厅扩展导入</Button
          >
          </div>
        </div>
      </template>
    </page-table>
    <EditPopup ref="EditPopup"></EditPopup>
    <ImportPopup ref="ImportPopup"></ImportPopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import { mapState } from 'vuex'
import baseApi from './vpay-unionpay-management-api'

const getDefFormData = () => ({
  brand: -1,
  storeCode: '',
  isFranchisees: -1
})

const getRealFromData = (formData) => {
  const res = { ...formData }
  res.brand === -1 && delete res.brand
  if (res.isFranchisees === -1) {
    delete res.isFranchisees
  } else {
    res.isFranchisees = res.isFranchisees === 'true'
  }
  return res
}

export default {
  name: 'vPayUnionpayManagement',
  mixins: [commMixin],
  data () {
    return {
      mbOff: false,
      ctOff: false,
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
              title: '餐厅编号',
              key: 'storeCode',
              // align: 'center',
              minWidth: 100
            },
            {
              title: '餐厅名称',
              key: 'storeName',
              // align: 'center',
              minWidth: 130
            },
            {
              title: '品牌',
              key: 'brand',
              // align: 'center',
              minWidth: 100
            },
            {
              title: '区域',
              key: 'name',
              // align: 'center',
              minWidth: 130
            },
            {
              title: '详细地址',
              key: 'detailAddr',
              // align: 'center',
              minWidth: 150
            },
            {
              title: '餐厅类型',
              key: 'isFranchisees',
              // align: 'center',
              width: 60,

              render: (h, { row, column }) => {
                return h('span', {}, row[column.key] ? '加盟' : '直营')
              }
            },
            {
              title: '法人公司',
              key: 'companyName',
              // align: 'center',
              minWidth: 159
            },
            {
              title: '操作',
              key: 'reason',
              align: 'center',
              width: 120,
              render: (h, params) => {
                return [
                  h(
                    'a',
                    {
                      // style: {
                      //   marginRight: '5px'
                      // },
                      on: {
                        click: () => {
                          // 显示编辑弹窗
                          this.showEditPopup(params)
                        }
                      }
                    },
                    '餐厅扩展信息'
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
    // this.mixin_queryFromPayTypeList();
    // this.mixin_queryFromAppList();
    // this.mixin_queryFormSignTypeList();
    this.mixin_queryFormAscriptionList()
    this.queryData()
    if (process.env.SSO_LOGIN) {
      this.isQx()
    } else {
      this.mbOff = true
      this.ctOff = true
    }
  },
  computed: mapState({
    userInfo: (state) => state.user.userInfo || {}
  }),
  mounted () {},
  beforeDestroy () {},
  components: {
    EditPopup: () => import('./components/edit-popup'),
    ImportPopup: () => import('./components/import-popup')
  },
  methods: {
    isQx () {
      const { userInfo: { permissions } } = this
      permissions && permissions.map((item, index) => {
        // 模板下载
        if (`${item.id}` === '1000') {
          this.mbOff = true
        }
        // 餐厅扩展导入
        if (`${item.id}` === '1001') {
          this.ctOff = true
        }
      })
    },
    showEditPopup ({ row, column, index }) {
      switch (column.key) {
        case 'reason':
        case 'add_data':
          this.$refs.EditPopup.showPopup(
            { row, column, index },
            {
              // srcBrandList: this.srcBrandList,
              // srcPayTypeList: this.srcPayTypeList,
              // srcSignTypeList: this.srcSignTypeList,
              isEdit: column.key === 'reason'
              // callback: () => {
              //   this.queryData()
              // }
            }
          )
          break
        default:
          break
      }
    },
    showImportPopup () {
      this.$refs.ImportPopup.showPopup({}, {
        srcBrandList: this.srcBrandList
      })
    },
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
    exportExcel () {
      const close = this.$Message.loading({
        content: '正在导出...',
        duration: 0
      })
      const param = getRealFromData(this.currentOptions)
      let times = this.gettime()
      baseApi.exportData({ ...param }, `餐厅报告导出_${times}.xlsx`)
        .finally(() => {
          close()
        })
    },
    gettime () {
      let today = new Date()
      let y = today.getFullYear()
      let m = today.getMonth()
      let d = today.getDate()
      let h = today.getHours()
      let i = today.getMinutes()
      let s = today.getSeconds()
      m = m + 1
      h = this.checkTime(h)
      d = this.checkTime(d)
      m = this.checkTime(m)
      i = this.checkTime(i)
      s = this.checkTime(s)
      return `${y}${m}${d}${h}${i}${s}`
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
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
    downloadTemplate () {
      baseApi.exportTemplate({}, '餐厅扩展导入模板.xlsx')
    }
  }
}
</script>

<style lang="less" src="./vpay-unionpay-management.less" scoped>
</style>
