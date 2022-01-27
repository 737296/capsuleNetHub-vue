<template>
  <div id="app-secret-management" class="page-root">
    <div class="form-box">
      <Form ref="formData" :model="formData" :label-width="96">
        <FormItem prop="appId" label="APPID：" class="cal-from-item">
          <Input type="text" v-model="formData.appId" placeholder="输入APPID" />
        </FormItem>
        <FormItem prop="appName" label="APP名称：" class="cal-from-item">
          <Select v-model="formData.appName">
            <Option
              :value="item.code"
              v-for="item in appList"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="channel" label="支付方式：" class="cal-from-item">
          <Select v-model="formData.channel">
            <Option
              :value="item.code"
              v-for="item in payTypeList"
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
            >查询</Button
          >
          <Button size="large" @click="resetForm">清空</Button>
        </div>
      </Form>
    </div>
    <page-table v-model="tableData" @on-table-ref="mixin_getTableRef">
      <template slot="oper">
        <Icon type="information-circled" class="oper-wrapper-icon" />
        <Button
          class="oper-wrapper-button"
          shape="circle"
          size="small"
          @click="showEditPopup({ column: { key: 'add_data' } })"
          >添加</Button
        >
      </template>
    </page-table>
    <EditPopup ref="EditPopup"></EditPopup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from './app-secret-management-api'

const getDefFormData = () => ({
  appId: '',
  appName: -1,
  channel: -1
})

const getRealFromData = (formData) => {
  const res = { ...formData }
  res.appName === -1 && delete res.appName
  res.channel === -1 && delete res.channel
  return res
}

export default {
  name: 'appSecretManagement',
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
              title: 'APPID',
              key: 'appId',
              // align: 'center',
              minWidth: 100

            },
            {
              title: 'APP名称',
              key: 'appName',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '支付方式',
              key: 'channel',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '签名方式',
              key: 'signType',
              // align: 'center',
              width: 60

            },
            {
              title: 'APP私钥',
              key: 'privateKey',
              // align: 'center',
              ellipsis: true

            },
            {
              title: 'APP公钥',
              key: 'publicKey',
              // align: 'center',
              ellipsis: true

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
    let params = {params: {channelFilter: 'filter01'}}
    this.mixin_queryFromPayTypeList(params)
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
    EditPopup: (resolve) => require(['./components/edit-popup'], resolve)
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
    }
  }
}
</script>

<style lang="less" src="./app-secret-management.less" scoped>
</style>
