<template>
  <Pupup v-model="popup.show" :loading="popup.loading" class-name="popup-model" width="none">
    <template slot="header"> 货劳分类规则管理 </template>
    <template slot="body">
      <div class="scroll-warp">
        <popup-condition
          v-model="editData"
          @on-ref="({ validate }) => (this.formEditValidate = validate)"
        ></popup-condition>
      </div>
    </template>
    <div slot="footer" class="ext-footer">
      <div class="flex center">
        <template v-if="popup.extData">
          <Button size="large" type="primary" @click="saveExtData">
            保存
          </Button>
        </template>
        <template v-else>
          <Button size="large" @click="_showPopup({})">清空</Button>
          <Button size="large" type="primary" @click="saveExtData">
            添加
          </Button>
        </template>
      </div>
      <page-table v-model="extTableData"> </page-table>
    </div>
  </Pupup>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from '../pay-channel-rule-gl-management-api'
const getDefEditData = () => [
  // 第一行
  [
    {
      span: 10,
      prop: 'channel',
      label: '支付方式：',
      component: 'Select',
      value: '',
      //   rule: [{ required: true, message: "请选择品牌", trigger: "blur" }],
      options: []
    },
    { span: 1 },
    {
      span: 10,
      prop: 'brand',
      label: '品牌：',
      component: 'Select',
      value: '',
      //   rule: [{ required: true, message: "请选择品牌", trigger: "blur" }],
      options: []
    }
  ],
  [
    {
      span: 10,
      prop: 'business',
      label: '业务编码：',
      component: 'Select',
      value: '',
      //   rule: [{ required: true, message: "请选择品牌", trigger: "blur" }],
      options: []
    },
    { span: 1 },
    {
      span: 10,
      prop: 'businessApp',
      label: '业务APPID：',
      component: 'Input',
      placeholder: '请输入业务APPID',
      value: '',
      //   rule: [{ required: true, message: "请选择品牌", trigger: "blur" }],
      options: []
    }
  ],
  [
    {
      span: 11,
      prop: 'financeDepartmentCode',
      label: '货劳分类：',
      component: 'Select',
      value: '',
      rule: [{ required: true, message: '请选择货劳分类限制', trigger: 'blur' }],
      options: []
    }
  ],
  // 第三行
  [
    {
      span: 21,
      prop: 'remark',
      label: '备注：',
      component: 'Input',
      type: 'textarea',
      //   placeholder: "请输入业务负责人",
      rows: 4,
      value: ''
      //   rule: [
      //     { required: true, message: "业务负责人不能为空", trigger: "blur" },
      //   ],
    }
  ]
]

const getDefPopup = () => ({
  show: false,
  data: null,
  loading: false
})
export default {
  mixins: [commMixin],
  data () {
    return {
      popup: {
        show: false,
        data: null,
        loading: false
      },
      editData: [],
      extTableData: {
        loading: false,
        table: {
          border: true,
          size: 'small',
          height: 165,
          columns: [
            {
              type: 'index',
              title: '序号',
              width: 60
              // align: 'center',

            },
            {
              title: '货劳分类CODE',
              key: 'financeDepartmentCode'
              // align: 'center',

            },
            {
              title: '货劳分类名称',
              key: 'financeDepartmentName'
              // align: 'center',

            },
            {
              title: '备注',
              key: 'remark'
              // align: 'center',

            },
            {
              title: '操作',
              key: 'reason',
              // align: 'center',

              width: 65,
              render: (h, params) => {
                return [
                  // h(
                  //   'a',
                  //   {
                  //     style: {
                  //       marginRight: '5px'
                  //     },
                  //     on: {
                  //       click: () => {
                  //         // 编辑
                  //         this.editExtData(params)
                  //       }
                  //     }
                  //   },
                  //   '编辑'
                  // ),
                  h(
                    'a',
                    {
                      on: {
                        click: () => {
                          // 删除
                          this.delExtData(params)
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
        }
      }
    }
  },
  methods: {
    showPopup (...params) {
      this.popup = getDefPopup()
      this.popup.srcData = params
      this._showPopup(...params)
    },
    _showPopup ({ row, column, index }) {
      const {
        srcBrandList,
        srcPayTypeList,
        srcBusinessList
        // srcMentBoxList
        // srcBusinessAppList
      } = this.popup.srcData[1]
      const isClean = !row
      !row && (row = this.popup.data)
      const editData = getDefEditData()
      this.$ArrayObjectEach(editData, (v) => {
        let value
        if (v && v.component) {
          (value = row[v.prop]) && (v.value = value)
          switch (v.prop) {
            case 'channel':
              v.options = srcPayTypeList
              v.disabled = true
              break
            case 'brand':
              v.options = srcBrandList
              v.disabled = true
              break
            case 'business':
              v.options = srcBusinessList
              v.disabled = true
              break
            case 'businessApp':
              // v.options = srcBusinessAppList
              v.disabled = true
              break
            case 'financeDepartmentCode':
              this.mixin_queryMentBoxList({
                brand: row.brand
              }).then(() => {
                v.options = this.srcMentBoxList
              })
              // v.options = srcMentBoxList
              break
            default:
              v.value = ''
              break
          }
        }
      })
      this.editData = editData
      this.popup.show = true
      this.popup.extData = null
      if (!isClean) {
        this.popup.data = row
        this.queryExtTable()
      }
    },
    saveExtData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          const reqPrm = {
            ...params,
            ruleId: this.popup.data.id
          }
          if (this.popup.extData) {
            reqPrm.id = this.popup.extData.id
          }
          baseApi
            .updateExtProductRule(reqPrm)
            .then(({ data }) => {
              if (data.code === 200) {
                this._showPopup({ row: this.popup.data })
                this.$Message.success(`保存成功`)
              } else {
                return Promise.reject(new Error(data.msg))
              }
            })
            .catch((err) => {
              this.$Message.error(`操作失败！${err.message}`)
              console.log(err)
            })
        }
      })
    },
    // editExtData ({ row, column, index }) {
    //   this.popup.loading = true
    //   baseApi
    //     .getExtProductRuleDetails({ id: row.id })
    //     .then(({ data }) => {
    //       if (data.code === 200) {
    //         if (data.data) {
    //           this.$ArrayObjectEach(this.editData, (v) => {
    //             if (v && v.component && v.prop in data.data) {
    //               v.value = data.data[v.prop]
    //             }
    //           })
    //           this.popup.extData = data.data
    //         }
    //       } else {
    //         return Promise.reject(new Error(data.msg))
    //       }
    //     })
    //     .catch((err) => {
    //       this.$Message.error(`查询失败！${err.message}`)
    //       console.log(err)
    //     })
    //     .finally(() => {
    //       this.popup.loading = false
    //     })
    // },
    delExtData ({ row, column, index }) {
      baseApi
        .delExtProductRule({ id: row.id })
        .then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success(`操作成功`)
            this._showPopup({ row: this.popup.data })
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`操作失败！${err.message}`)
          console.log(err)
        })
    },
    queryExtTable () {
      this.extTableData.loading = true
      baseApi
        .queryExtProductTable({
          id: this.popup.data.id,
          channel: this.popup.data.channel,
          brand: this.popup.data.brand,
          business: this.popup.data.business,
          businessApp: this.popup.data.businessApp
        })
        .then(({ data }) => {
          if (data.code === 200) {
            if (data.data) {
              this.extTableData.table.data = data.data
            }
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.extTableData.loading = false
        })
    }
  }
}
</script>

<style>
</style>
