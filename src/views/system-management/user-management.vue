<template>
  <div id="user-management"
       class="page-root">
    <div class="form-box">
      <Form ref="formData"
            :model="formData"
            :label-width="96">
        <FormItem prop="account"
                  label="账号："
                  class="cal-from-item">
          <Input type="text"
                 v-model="formData.account"
                 placeholder="输入账号" />
        </FormItem>
        <FormItem prop="accountName"
                  label="姓名："
                  class="cal-from-item">
          <Input type="text"
                 v-model="formData.accountName"
                 placeholder="输入姓名" />
        </FormItem>
        <FormItem prop="supervisorName"
                  label="审批主管名："
                  class="cal-from-item">
          <Input type="text"
                 v-model="formData.supervisorName"
                 placeholder="输入审批主管名" />
        </FormItem>
        <FormItem prop="email"
                  label="邮箱："
                  class="cal-from-item">
          <Input type="text"
                 v-model="formData.email"
                 placeholder="输入邮箱" />
        </FormItem>
        <FormItem prop="enableFlag"
                  label="状态："
                  class="cal-from-item">
          <Select v-model="formData.enableFlag">
            <Option :value="item.code"
                    v-for="item in stateList"
                    :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <div class="button-grounp">
          <Button size="large"
                  type="primary"
                  @click="
              currentOptions = $copy(formData);
              queryData();
            ">查询</Button>
          <Button size="large"
                  @click="resetForm">清空</Button>
        </div>
      </Form>
    </div>
    <page-table v-model="tableData"
                @on-table-ref="mixin_getTableRef">
      <template slot="oper">
        <Icon type="information-circled"
              class="oper-wrapper-icon" />
        <Button class="oper-wrapper-button"
                shape="circle"
                size="small"
                @click="showEditPopup({ column: { key: 'add_data' } })">添加</Button>
      </template>
    </page-table>
    <EditPopup ref="EditPopup"></EditPopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from './user-management-api'

const getDefFormData = () => ({
  account: '',
  accountName: '',
  supervisorName: '',
  email: '',
  enableFlag: -1
})

const getRealFromData = (formData) => {
  const res = { ...formData }
  res.enableFlag === -1 && delete res.enableFlag
  if ('enableFlag' in res) {
    res.enableFlag = res.enableFlag === 'true'
  }
  return res
}

export default {
  name: 'userManagement',
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
              title: '账号',
              key: 'account',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '姓名',
              key: 'accountName',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '审批主管名',
              key: 'supervisorName',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '手机号',
              key: 'phone',
              // align: 'center',
              minWidth: 110

            },
            {
              title: '邮箱',
              key: 'email',
              // align: 'center',
              minWidth: 120

            },
            {
              title: '分配角色',
              key: 'list',
              // align: 'center',
              minWidth: 130,

              render: (h, { row, column }) => {
                return (row[column.key] || []).map((v, i) => {
                  return h('span', {
                    style: {
                      marginLeft: i !== 0 ? '5px' : '0px'
                    }
                  }, this.roleMap[v])
                })
              }
            },
            {
              title: 'AD_ID',
              key: 'adId',
              // align: 'center',
              minWidth: 100
            },
            {
              title: '状态',
              key: 'enableFlag',
              // align: 'center',
              minWidth: 60,

              render: (h, { row, column }) => h('span', {}, row[column.key] ? '启用' : '禁用')
            },
            {
              title: '操作',
              key: 'reason',
              // align: 'center',
              width: 70,
              render: (h, params) => {
                return [
                  h(
                    'Icon',
                    {
                      props: {
                        type: 'edit'
                      },
                      style: {
                        color: '#2d8cf0',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          // 显示编辑弹窗
                          this.showEditPopup(params)
                        }
                      }
                    }
                  ),
                  h(
                    'Icon',
                    {
                      props: {
                        type: 'trash-a'
                      },
                      style: {
                        color: '#ed3f14',
                        fontSize: '18px',
                        cursor: 'pointer',
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          // 显示编辑弹窗
                          this.delData(params)
                        }
                      }
                    }
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
  computed: {
    roleMap () {
      return (this.srcRoleList || []).reduce((sum, val) => {
        sum[val.code] = val.name
        return sum
      }, {})
    }
  },
  created () {
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
  components: {
    EditPopup: (resolve) => require(['./components/user-edit-popup'], resolve)
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
          ...getRealFromData(this.currentOptions),
          pageNum: this.tableData.page.current, // 当前页
          pageSize: this.tableData.page.pageSize // 每页条数
        })
        .then(({ data }) => {
          if (+data.code === 200) {
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

<style lang="less" src="./user-management.less" scoped>
</style>
