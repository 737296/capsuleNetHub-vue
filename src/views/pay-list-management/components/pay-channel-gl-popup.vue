<template>
  <Pupup v-model="popup.show" :loading="popup.loading" class-name="popup-model" width="none">
    <template slot="header"> 支付渠道规则(货劳) </template>
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
    </div>
  </Pupup>
</template>

<script>
import commMixin from '@/mixin'
import baseApi from '../pay-channel-rule-gl-management-api'
import { num2cnnum } from '@/utils/common'
const getDefEditData = (vm) => {
  const {
    srcBusinessList,
    srcBusinessAppList
  } = vm.popup.srcData[1]

  const setBusinessConfigOptions = () => {
    businessConfig.options = vm.mixin_findBusinessListByBrandCode(brandConfig.value, srcBusinessList)
    !businessConfig.options.some(({code}) => code === businessConfig.value) && (businessConfig.value = '')
  }

  const setBusinessAppOptions = () => {
    businessAppConfig.options = vm.mixin_getBusinessAppByOptions({ businessCode: businessConfig.value, brandCode: brandConfig.value }, srcBusinessAppList)
    !businessAppConfig.options.some(({code}) => code === businessAppConfig.value) && (businessAppConfig.value = '')
  }

  const brandConfig = {
    span: 11,
    prop: 'brand',
    label: '品牌：',
    component: 'Select',
    value: '',
    oldValue: '',
    rule: [{ required: true,
      message: '请选择品牌',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const error = []
        if (!value) {
          error.push(rule.message)
        } else if (value !== brandConfig.oldValue) {
          brandConfig.oldValue = value

          setBusinessConfigOptions()
          setBusinessAppOptions()
        }
        callback(error)
      }
    }],
    options: []
  }

  const businessConfig = {
    span: 11,
    prop: 'business',
    label: '业务编码：',
    component: 'Select',
    value: '',
    oldValue: '',
    placeholder: '全部',
    // 可清空
    clearable: true,
    rule: [{ required: false,
      message: '请选择业务编码',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const error = []
        if (value !== businessConfig.oldValue) {
          businessConfig.oldValue = value

          setBusinessAppOptions()
        }
        callback(error)
      }
    }],
    options: []
  }

  const businessAppConfig = {
    span: 11,
    prop: 'businessApp',
    label: '业务APPID：',
    type: 'Input',
    component: 'Select',
    value: '',
    placeholder: '全部',
    // 可清空
    clearable: true,
    rule: [{ required: false,
      message: '请选择业务APPID',
      trigger: 'blur'
      // validator: (rule, value, callback) => {
      //   const error = []
      //   if (!value) {
      //     error.push(rule.message)
      //   }
      //   callback(error)
      // }
    }],
    options: []
  }

  return {
    init: () => {
      setBusinessConfigOptions()
      setBusinessAppOptions()
    },
    data: [
      // 第一行
      [
        {
          span: 11,
          prop: 'channel',
          label: '支付方式：',
          component: 'Select',
          value: '',
          rule: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
          options: []
        },
        { span: 1 },
        brandConfig
      ],
      [
        businessConfig,
        { span: 1 },
        businessAppConfig
      ],
      [
        {
          span: 11,
          prop: 'datetimeRange',
          label: '日期范围：',
          placeholder: '请选择日期范围',
          component: 'DatePicker',
          type: 'datetimerange',
          format: 'yyyy/MM/dd HH:mm',
          placement: 'bottom-end',
          value: [],
          rule: [
            {
              required: true,
              type: 'array',
              message: '请选择日期范围',
              trigger: 'blur',
              validator: (rule, value, callback) => {
                const error = []
                if (!value[0] || !value[1]) {
                  error.push(rule.message)
                }
                callback(error)
              }
            }
          ]
        },
        { span: 1 },
        {
          span: 11,
          prop: 'dayWeekAvailable',
          label: '有效日期：',
          component: 'TagSelect',
          value: [],
          rule: [
            {
              required: true,
              type: 'array',
              message: '至少选中一个有效日期',
              trigger: 'blur',
              validator: (rule, value, callback) => {
                const error = []
                if (value.length === 0) {
                  error.push(rule.message)
                }
                callback(error)
              }
            }
          ],
          options: []
        }
      ],
      [
        {
          span: 11,
          prop: 'financeDepartmentRule',
          label: '货劳分类限制：',
          component: 'Select',
          value: '',
          rule: [{ required: true, message: '请选择货劳分类限制', trigger: 'blur' }],
          options: []
        }
      ],
      [
        {
          span: 21,
          prop: 'remark',
          label: '备注：',
          component: 'Input',
          type: 'textarea',
          rows: 4,
          value: ''
        }
      ]
    ]
  }
}
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
      editData: []
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
        srcBusinessList,
        srcBusinessAppList,
        srcDepartmentRuleList,
        srcBrandList,
        srcPayTypeList,
        // 默认是编辑状态
        isEdit = true
      } = this.popup.srcData[1]
      const isClean = !row
      !row && (row = this.popup.data || {})
      const {data: editData, init: initEditData} = getDefEditData(this)
      this.$ArrayObjectEach(editData, (v) => {
        let value
        if (v && v.component) {
          (value = row[v.prop]) && (v.value = value)
          switch (v.prop) {
            case 'channel':
              v.options = srcPayTypeList
              v.disabled = isEdit
              break
            case 'brand':
              v.options = srcBrandList
              break
            case 'business':
              v.options = this.mixin_getUnrepeatedList(srcBusinessList)
              break
            // TODO 这个没有接口
            case 'businessApp':
              v.options = this.mixin_getUnrepeatedList(srcBusinessAppList)
              break
            case 'datetimeRange':
              v.value = []
              row.startDatetime
                ? v.value.push(new Date(row.startDatetime))
                : v.value.push('')
              row.endDatetime
                ? v.value.push(new Date(row.endDatetime))
                : v.value.push('')
              break
            case 'dayWeekAvailable':
              if ((value = row[v.prop])) {
                v.value = value.split(',').filter((v) => v)
              }
              v.options = new Array(7).fill(null).map((v, i) => ({
                code: String(i + 1),
                color: 'blue',
                name: '周' + (i !== 6 ? num2cnnum(i + 1) : '日')
              }))
              break
            case 'financeDepartmentRule':
              v.options = srcDepartmentRuleList
              break
            default:
              break
          }
        }
      })
      initEditData()
      this.editData = editData
      this.popup.show = true
      this.popup.extData = isEdit
      if (!isClean) {
        this.popup.data = row
        // this.queryExtTable();
      }
    },
    saveExtData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          const reqPrm = {
            ...params
          }
          if (this.popup.extData) {
            reqPrm.id = this.popup.data.id
            reqPrm.dateId = this.popup.data.dateId
            reqPrm.switchId = this.popup.data.switchId
            // reqPrm.businessApp = this.popup.data.businessApp
          }
          const daterange = reqPrm.datetimeRange
          delete reqPrm.datetimeRange
          if (daterange) {
            const toFormatDate = (str) => {
              if (str instanceof Date) {
                return this.$formatDate(str, 'yyyy-MM-dd HH:mm:ss')
              } else {
                return str.replace(/\//g, '-') + ':00'
              }
            }
            const [st, et] = daterange || []
            st && (reqPrm.startDatetime = toFormatDate(st))
            et && (reqPrm.endDatetime = toFormatDate(et))
          }
          reqPrm.dayWeekAvailable = (reqPrm.dayWeekAvailable || []).join(',')
          baseApi
            .updatePayChannelData(reqPrm, { isEdit: this.popup.extData })
            .then(({ data }) => {
              if (data.code === 200) {
                const callback = this.popup.srcData[1].callback
                callback && callback()
                this.$Message.success(`保存成功`)
                this.popup.show = false
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
    }
  }
}
</script>

<style>
</style>
