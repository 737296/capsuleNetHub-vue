<template>
  <div id="pay-channel-rule-gl-management" class="page-root">
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
        <FormItem prop="business" label="日期范围：" class="cal-from-item">
          <DatePicker
            :value="formData.daterange"
            @on-change="(daterange) => (formData.daterange = daterange)"
            format="yyyy/MM/dd HH:mm"
            type="datetimerange"
            placement="bottom-end"
            placeholder="选择时间范围"
            style="width: 100%"
          ></DatePicker>
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
    <GoodsLaborPopup ref="GoodsLaborPopup"></GoodsLaborPopup>
    <PayChannelGLPopup ref="PayChannelGLPopup"></PayChannelGLPopup>
  </div>
</template>

<script>
import { getPayChannelRuleByType, num2cnnum } from '@/utils/common.js'
import commMixin from '@/mixin'
import baseApi from './pay-channel-rule-gl-management-api'

const getDefFormData = () => ({
  brand: -1,
  daterange: ['', ''],
  channel: -1
})

const getRealFromData = (formData) => {
  const toFormatDate = (str) => str.replace(/\//g, '-') + ':00'
  const res = { ...formData }
  res.brand === -1 && delete res.brand
  res.channel === -1 && delete res.channel
  const daterange = res.daterange
  delete res.daterange
  if (daterange) {
    const [startDatetime, endDatetime] = daterange || []
    startDatetime && (res.startDatetime = toFormatDate(startDatetime))
    endDatetime && (res.endDatetime = toFormatDate(endDatetime))
  }
  return res
}

export default {
  name: 'payChannelRuleGLManagement',
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
              title: '支付方式',
              key: 'channel',
              // align: 'center',
              minWidth: 60

            },
            {
              title: '品牌',
              key: 'brand',
              // align: 'center',
              minWidth: 80

            },
            {
              title: '业务编码',
              key: 'business',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '业务APPID',
              key: 'businessApp',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '日期范围',
              key: 'startDatetime',
              // align: 'center',
              width: 130,

              render: (h, { row }) => {
                return [
                  h('span', {}, row.startDatetime),
                  h('div'),
                  h('span', {}, row.endDatetime)
                ]
              }
            },
            {
              title: '有效日期',
              key: 'dayWeekAvailable',
              // align: 'center',
              minWidth: 100,

              render: (h, { row, column }) => {
                const num = row[column.key]
                return h(
                  'span',
                  {},
                  num
                    ? num
                      .split(',')
                      .map((v) => num2cnnum(v))
                      .join(' ')
                    : ''
                )
              }
            },
            {
              title: '货劳分类限制',
              key: 'financeDepartmentRule',
              // className: 'flex center',
              width: 100,
              render: (h, params) => {
                const { row, column: { key } } = params
                const value = row[key]
                if (value === 'no') {
                  return h('span', {}, '-')
                } else {
                  return h(
                    'a',
                    {
                      on: {
                        click: () => {
                          this.showEditPopup(params)
                        }
                      }
                    },
                    getPayChannelRuleByType(value).name
                  )
                }
              }
            },
            {
              title: '备注',
              key: 'remark',
              // align: 'center',
              width: 180,
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
    // this.mixin_queryMentBoxList()
    this.mixin_queryFormBrandList()
    this.mixin_queryFromPayTypeList()
    this.mixin_queryFromDepartmentRuleList()
    this.mixin_queryFormBusinessList()
    this.mixin_queryFormBusinessAppList()
    this.queryData()
  },
  mounted () {},
  beforeDestroy () {},
  components: {
    GoodsLaborPopup: (resolve) => require(['./components/goods-labor-popup'], resolve),
    PayChannelGLPopup: (resolve) =>
      require(['./components/pay-channel-gl-popup'], resolve)
  },
  methods: {
    showEditPopup ({ row, column, index }) {
      switch (column.key) {
        case 'financeDepartmentRule':
          this.$refs.GoodsLaborPopup.showPopup(
            { row, column, index },
            {
              srcMentBoxList: this.srcMentBoxList,
              srcBrandList: this.srcBrandList,
              srcPayTypeList: this.srcPayTypeList,
              srcBusinessList: this.srcBusinessList
            }
          )
          break
        case 'reason':
        case 'add_data':
          this.$refs.PayChannelGLPopup.showPopup(
            { row, column, index },
            {
              srcBusinessAppList: this.srcBusinessAppList,
              srcDepartmentRuleList: this.srcDepartmentRuleList,
              srcBusinessList: this.srcBusinessList,
              srcBrandList: this.srcBrandList,
              srcPayTypeList: this.srcPayTypeList,
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
        .delPayChannelData({
          id: row.id,
          dateId: row.dateId,
          switchId: row.switchId
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
        .queryPayChannelTable({
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

<style lang="less" src="./pay-channel-rule-gl-management.less" scoped>
</style>
