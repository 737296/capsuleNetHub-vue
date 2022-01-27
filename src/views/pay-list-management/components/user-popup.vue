<template>
  <Pupup
    v-model="popup.show"
    :loading="popup.loading"
    class-name="popup-model"
    width="none"
  >
    <template slot="header"> 用户规则管理 </template>
    <template slot="body">
      <div class="scroll-warp">
        <popup-condition
          v-show="!showFileImoprt"
          v-model="editData"
          @on-ref="({ validate }) => (this.formEditValidate = validate)"
        ></popup-condition>
        <popup-condition
          v-show="showFileImoprt"
          v-model="inputTypeConfigShadow"
          @on-ref="({ validate }) => (this.formEditShadowValidate = validate)"
        ></popup-condition>
        <file-info
          v-show="showFileImoprt"
          v-model="inputTypeConfig.fileInfo.data"
          :fileName.sync="inputTypeConfig.fileInfo.name"
        />
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
import baseApi from '../pay-channel-rule-management-api'
import { getPayChannelRuleByType } from '@/utils/common'
const getDefEditData = () => {
  const mobileConfig = {
    span: 10,
    prop: 'mobile',
    label: '用户手机号：',
    component: 'Input',
    // type: "textarea",
    placeholder: '请输入商品用户手机号',
    // rows: 2,
    value: '',
    rule: [
      {
        required: false,
        message: '用户手机号与用户code不能同时为空',
        trigger: 'blur'
      }
    ]
  }
  const userCodeConfig = {
    span: 10,
    prop: 'userCode',
    label: '用户code：',
    component: 'Input',
    placeholder: '请输入用户Code',
    value: '',
    rule: [
      {
        required: false,
        message: '用户手机号与用户code不能同时为空',
        trigger: 'blur'
      }
    ],
    options: []
  }
  const validator = (rule, value, callback) => {
    const error = []
    if (!mobileConfig.value && !userCodeConfig.value) {
      error.push(rule.message)
    }
    callback(error)
  }
  mobileConfig.rule[0].validator = validator
  userCodeConfig.rule[0].validator = validator

  const inputTypeConfig = {
    span: 10,
    prop: 'inputType',
    label: '录入方式：',
    component: 'Select',
    value: 'page',
    fileInfo: {
      data: null,
      name: ''
    },
    options: []
  }

  return {
    inputTypeConfig,
    data: [
      // 第一行
      [
        inputTypeConfig,
        { span: 1 },
        {
          span: 10,
          prop: 'ruleType',
          label: '规则分类：',
          component: 'Select',
          value: '',
          //   rule: [{ required: true, message: "请选择品牌", trigger: "blur" }],
          options: []
        }
      ],
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
      [mobileConfig, { span: 1 }, userCodeConfig]
    ]
  }
}

const getDefPopup = () => ({
  show: false,
  data: null,
  loading: false
})
export default {
  components: {
    FileInfo: () => import('./file-info')
  },
  data () {
    return {
      popup: {
        show: false,
        data: null,
        extData: null,
        loading: false
      },
      editData: [],
      inputTypeConfig: {
        fileInfo: {
          data: null,
          name: ''
        }
      },
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
              title: '支付方式',
              key: 'channel'
              // align: 'center',

            },
            {
              title: '品牌',
              key: 'brand'
              // align: 'center',

            },
            {
              title: '规则分类',
              key: 'ruleType',
              // align: 'center',

              render: (h, { row, column }) => {
                return h(
                  'span',
                  {},
                  getPayChannelRuleByType(row[column.key]).name
                )
              }
            },
            {
              title: '用户手机号',
              key: 'mobile'
              // align: 'center',

            },
            {
              title: '用户Code',
              key: 'userCode'
              // align: 'center',

            },
            {
              title: '操作',
              key: 'reason',
              // align: 'center',

              width: 65,
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
                          // 编辑
                          this.editExtData(params)
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
  computed: {
    showFileImoprt () {
      const { value = 'page' } = this.inputTypeConfig || {}
      return value !== 'page'
    },
    inputTypeConfigShadow () {
      return [[this.inputTypeConfig || {}]]
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
        srcUserRuleList,
        srcBrandList,
        srcPayTypeList,
        srcBusinessList
        // srcBusinessAppList
      } = this.popup.srcData[1]
      const isClean = !row
      !row && (row = this.popup.data)
      const { data: editData, inputTypeConfig } = getDefEditData()
      this.$ArrayObjectEach(editData, (v) => {
        let value
        if (v && v.component) {
          (value = row[v.prop]) && (v.value = value)
          switch (v.prop) {
            case 'inputType':
              v.value = 'page'
              v.options = [
                {
                  code: 'page',
                  name: '页面录入'
                },
                {
                  code: 'file',
                  name: '模板录入'
                }
              ]
              break
            case 'ruleType':
              (value = row['usersRule']) && (v.value = value)
              v.options = srcUserRuleList
              v.disabled = true
              break
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
            default:
              v.value = ''
              break
          }
        }
      })
      this.inputTypeConfig = inputTypeConfig
      this.editData = editData
      this.popup.show = true
      this.popup.extData = null
      if (!isClean) {
        this.popup.data = row
        this.queryExtTable()
      }
    },
    saveExtData () {
      !this.showFileImoprt
        ? this.formEditValidate((valid, params) => {
          if (valid) {
            const reqPrm = {
              ...params,
              ruleId: this.popup.data.id,
              business: this.popup.data.business
            }
            if (this.popup.extData) {
              reqPrm.id = this.popup.extData.id
            }
            baseApi
              .updateExtUserRule(reqPrm)
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
        : this.formEditShadowValidate((valid, params) => {
          if (valid) {
            const { data: file } = this.inputTypeConfig.fileInfo
            if (!file) {
              this.inputTypeConfig.fileInfo = `<span style="color: red;">请选择文件</span>`
              return
            }
            baseApi
              .fileImportUserRule(file, {
                id: this.popup.data.id
              })
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
    editExtData ({ row, column, index }) {
      // this.popup.loading = true
      // baseApi
      //   .getExtUserRuleDetails({ id: row.id })
      //   .then(({ data }) => {
      //     if (data.code === 200) {
      //       if (data.data) {
      //         this.$ArrayObjectEach(this.editData, (v) => {
      //           if (v && v.component) {
      //             v.prop in data.data && (v.value = data.data[v.prop])
      //             switch (v.prop) {
      //               case 'inputType':
      //                 v.value = 'page'
      //                 v.disabled = true
      //                 break
      //               default:
      //                 break
      //             }
      //           }
      //         })
      //         this.popup.extData = data.data
      //       }
      //     } else {
      //       return Promise.reject(new Error(data.msg))
      //     }
      //   })
      //   .catch((err) => {
      //     this.$Message.error(`查询失败！${err.message}`)
      //     console.log(err)
      //   })
      //   .finally(() => {
      //     this.popup.loading = false
      //   })

      this.popup.loading = true
      this.$ArrayObjectEach(this.editData, (v) => {
        if (v && v.component) {
          v.prop in row && (v.value = row[v.prop])
          switch (v.prop) {
            case 'inputType':
              v.value = 'page'
              v.disabled = true
              break
            default:
              break
          }
        }
      })
      this.$nextTick(() => {
        this.popup.extData = row
        this.popup.loading = false
      })
    },
    delExtData ({ row, column, index }) {
      baseApi
        .delExtUserRule({ id: row.id })
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
        .queryExtUserTable({
          ruleId: this.popup.data.id
          // ruleType: this.popup.data.usersRule,
          // channel: this.popup.data.channel,
          // brand: this.popup.data.brand,
          // business: this.popup.data.business,
          // businessApp: this.popup.data.businessApp
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
