<template>
  <div id="role-management" class="page-root">
    <div class="form-box">
      <Form ref="formData" :model="formData" :label-width="96">
        <FormItem prop="searchRole" label="名称或描述：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.searchRole"
            placeholder="名称或描述"
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
    <Layout class="table-layout">
      <Content class="table-content">
        <page-table v-model="tableData" @on-table-ref="mixin_getTableRef">
          <template slot="oper">
            <div class="table-oper">
              <h3 class="table-title">角色列表</h3>
              <Button
                class="oper-wrapper-button"
                shape="circle"
                size="small"
                @click="showEditPopup({ column: { key: 'add_data' } })"
                >添加</Button
              >
            </div>
          </template>
        </page-table>
      </Content>
      <Sider hide-trigger :width="400" class="table-content">
        <div class="table-box border">
          <div class="oper-wrapper table-oper">
            <h3 class="table-title">菜单列表</h3>
            <Button
              :disabled="!this.selectedRow"
              class="oper-wrapper-button"
              shape="circle"
              size="small"
              @click="saveMenuData()"
              >保存</Button
            >
          </div>
          <div class="table-body">
            <Tree ref="MenuTree" :data="srcCopyMenuTree" :show-checkbox="!!selectedRow"></Tree>
          </div>
        </div>
      </Sider>
    </Layout>
    <EditPopup ref="EditPopup"></EditPopup>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import commMixin from '@/mixin'
import baseApi from './role-management-api'

const getDefFormData = () => ({
  searchRole: ''
})

const getRealFromData = formData => {
  const res = { ...formData }
  return res
}

export default {
  name: 'roleManagement',
  mixins: [commMixin],
  data () {
    return {
      selectedRow: null,
      tableData: {
        loading: false,
        table: {
          border: true,
          height: 0,
          highlightRow: true,
          on: {
            'on-current-change': row => {
              baseApi
                .getDetails({
                  id: row.id
                })
                .then(({ data }) => {
                  if (data.code === 200) {
                    this.selectedRow = data.data
                    return Promise.resolve(data.data)
                  } else {
                    return Promise.reject(new Error(data.msg))
                  }
                })
                .catch((err) => {
                  this.$Message.error(`操作失败！${err.message}`)
                  console.log(err)
                  return Promise.reject(err)
                })
            }
          },
          columns: [
            {
              type: 'index',
              title: '序号',
              // align: 'center',
              width: 60
            },
            {
              title: '名称',
              key: 'roleName',
              // align: 'center',
              minWidth: 100
            },
            {
              title: '描述',
              key: 'remark',
              // align: 'center',
              minWidth: 120
            },
            {
              title: '角色状态',
              key: 'enableFlag',
              // align: 'center',
              minWidth: 80,
              render: (h, { row, column }) => h('span', {}, row[column.key] ? '启用' : '禁用')
            },
            {
              title: '创建日期',
              key: 'createDate',
              // align: 'center',
              minWidth: 130
            },
            {
              title: '操作',
              key: 'reason',
              width: 70,
              render: (h, params) => {
                return [
                  h('Icon', {
                    props: {
                      type: 'edit'
                    },
                    style: {
                      color: this.selectedRow && this.selectedRow.id === params.row.id ? '#fff' : '#2d8cf0',
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
                  }),
                  h('Icon', {
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
                  })
                ]
              }
            }
          ],
          data: []
        }
        // page: {
        //   hide: false
        // }
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
    },
    srcCopyMenuTree () {
      const { selectedRow } = this
      let srcMenuTree = this.$copy(this.srcMenuTree)
      if (selectedRow && (selectedRow.list || []).length > 0) {
        const idMap = selectedRow.list.reduce((sum, val) => {
          sum[val] = true
          return sum
        }, {})
        this.$ArrayObjectEach(srcMenuTree, (node, parent, key, depth) => {
          if (node.children) {
            node.children.forEach((c) => {
              c.pid = node.id
            })
          }
          node.expand = false
          // if (idMap[node.id]) {
          //   node.checked = true
          //   if (parent && key) {
          //     parent.expand = true
          //   }else{}
          // }else{
          // }
          // console.log('node',node)
          if (node.pid === '0') {
            node.expand = true
          } else {
            if (idMap[node.id]) {
              node.checked = true
            }
          }
        })
      }
      return srcMenuTree
    }
  },
  created () {
    this.currentOptions = this.$copy(this.formData)
    this.mixin_queryFormStateList()
    this.mixin_queryMenuTree()
    // this.mixin_queryFromRoleList()
    // this.mixin_queryFormBrandList()
    // this.mixin_queryFromPayTypeList();
    // this.mixin_queryFromAppList();
    // this.mixin_queryFormSignTypeList();
    // this.mixin_queryFormAscriptionList();
    this.queryData()
  },
  mounted () {},
  beforeDestroy () {},
  components: {
    EditPopup: resolve => require(['./components/role-edit-popup'], resolve)
  },
  methods: {
    showEditPopup ({ row, column, index }) {
      switch (column.key) {
        case 'reason':
        case 'add_data':
          this.$refs.EditPopup.showPopup(
            { row, column, index },
            {
              srcMenuTree: this.$copy(this.srcMenuTree),
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
        .catch(err => {
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
          if (data.code === 200) {
            // this.tableData.page.total = data.data.totalNum
            this.tableData.table.data = data.data
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch(err => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.selectedRow = null
          this.tableData.loading = false
        })
    },
    saveMenuData () {
      const nodes = this.$refs.MenuTree.getCheckedNodes()
      const nodeids = Object.keys((nodes || []).filter(node => !node.children).reduce((sum, val) => {
        val.id && (sum[val.id] = true)
        val.pid && (sum[val.pid] = true)
        return sum
      }, {}))

      baseApi
        .updateData({ ...pick(this.selectedRow, ['id', 'roleName', 'roleCode', 'remark', 'enableFlag']), list: nodeids }, { isEdit: true })
        .then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success(`保存成功`)
            this.queryData()
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`操作失败！${err.message}`)
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" src="./role-management.less" scoped></style>
