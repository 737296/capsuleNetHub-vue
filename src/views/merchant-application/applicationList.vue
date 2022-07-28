<template>
  <div id="user-management"
       class="page-root">
    <div class="form-box">
      <Form ref="formData"
            :model="formData"
            :label-width="96">
        <FormItem prop="legalCode"
                  label="法人编号："
                  class="cal-from-item">
          <Input type="text"
                 v-model="formData.legalCode"
                 placeholder="法人编号" />
        </FormItem>
        <FormItem label="公司名"
                  class="cal-from-item">
          <Input type="text"
                 v-model="formData.companyName"
                 placeholder="公司名" />
        </FormItem>
        <FormItem label="是否加盟："
                  class="cal-from-item">
          <Select style="width: 200px"
                  v-model="formData.isFranchisees">
            <Option v-for="item in isFranchiseesList"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="applicationStatus"
                  label="状态："
                  class="cal-from-item">
          <Select v-model="formData.applicationStatus"
                  style="width: 200px">
            <Option v-for="item in applicationStatusList"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <div class="button-grounp">
          <Button size="large"
                  type="primary"
                  @click="queryData()">查询</Button>
          <Button size="large"
                  @click="resetForm">清空</Button>
        </div>
      </Form>
    </div>
    <page-table v-model="tableData"
                @on-table-ref="mixin_getTableRef">
      <!-- <template slot="oper">
        <Icon type="information-circled" class="oper-wrapper-icon" />
        <Button
          class="oper-wrapper-button"
          shape="circle"
          size="small"
          @click="showEditPopup({ column: { key: 'add_data' } })"
          >添加</Button
        >
      </template> -->
    </page-table>
    <EditPopup ref="EditPopup"></EditPopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from './application-api'

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
  name: 'applicationList',
  mixins: [commMixin],
  data () {
    return {
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
              width: 60
            },
            {
              title: '法人编码',
              key: 'legalCode',
              align: 'center',
              minWidth: 100
            },
            {
              title: '公司名',
              key: 'companyName',
              align: 'center',
              minWidth: 110
            },
            {
              title: '是否加盟',
              key: 'isFranchisees',
              align: 'center',
              minWidth: 60,
              render: (h, { row }) =>
                h('span', {}, row['isFranchisees'] ? '是' : '否')
            },
            {
              title: '状态',
              key: 'applicationStatus',
              align: 'center',
              minWidth: 60,
              render: (h, { row }) => {
                return [
                  h('div', row['applicationStatus']),
                  h('div',
                    {
                      // 控制render里面的元素是否显示
                      directives: [{
                        name: 'show',
                        value: row['applicationStatus'] === '待账户验证'
                      }]
                    },
                    [h('Input', {
                      props: {
                        value: this.Checkamount
                      },
                      on: {
                        'on-change': (e) => {
                          this.Checkamount = e.target.value
                        }
                      }
                    }),
                    h('Button', {

                      on: {
                        click: () => {
                          this.Checkallamount(row['legalCode'], this.Checkamount)
                        }
                      }
                    }, '校验金额')]
                  )

                ]
              }

            },

            {
              title: '操作',
              // key: "applicationStatus",
              align: 'center',
              width: 160,
              render: (h, { row, column }) => {
                return [
                  h(
                    'a',
                    {
                      on: {
                        click: () => {
                          // 显示新页面
                          this.$router.push({
                            name: 'merchantAdd',
                            params: {
                              data: row['legalCode'],
                              data1: row['companyName']
                            }
                          })
                        }
                      },
                      directives: [{
                        name: 'show',
                        value: row['applicationStatus'] === '待创建'
                      }]
                    },
                    '创建 '
                  ),

                  h(
                    'a',
                    {

                      on: {
                        click: () => {
                          // 显示新页面
                          this.$router.push({
                            name: 'merchantEdit',
                            params: {
                              data: row['legalCode'],
                              data1: row['companyName']
                            }
                          })
                        }
                      },
                      directives: [{
                        name: 'show',
                        value: (row['applicationStatus'] === '草稿保存') || (row['applicationStatus'] === '审核驳回')
                      }]
                    },
                    '编辑  '
                  ),
                  h(
                    'a',
                    {

                      on: {
                        click: () => {
                          // 显示新页面
                          this.$router.push({
                            name: 'accountBooksList',
                            params: { data: row['legalCode'] }
                          })
                        }
                      },
                      directives: [{
                        name: 'show',
                        value: (row['applicationStatus'] === '审核通过')
                      }]
                    },
                    '电子账簿  '

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
      formData: {
        legalCode: null,
        companyName: null,
        isFranchisees: null,
        applicationStatus: null
      },

      isFranchiseesList: [
        {
          value: null,
          label: '全部'
        },
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }

      ],
      applicationStatusList: [
        {
          value: null,
          label: '全部'
        },
        {
          value: '10000',
          label: '待创建'
        },
        {
          value: '10',
          label: '草稿保存'
        },
        {
          value: '11',
          label: '银联受理中'
        },
        {
          value: '20',
          label: '资料校验中'
        },
        {
          value: '21',
          label: '待账户验证'
        },
        {
          value: '22',
          label: '金额审核中'
        },
        {
          value: '23',
          label: '进件处理中'
        },
        {
          value: '24',
          label: '电子签约中'
        },
        {
          value: '25',
          label: '审核通过'
        },
        {
          value: '26',
          label: '审核驳回'
        },
        {
          value: '27',
          label: '账户冻结'
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
    // console.log("hahahah ");
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
  // components: {
  //   EditPopup: (resolve) => require(['./components/user-edit-popup'], resolve)
  // },
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
