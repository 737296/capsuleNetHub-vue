<template>
  <div id="business-app-management" class="page-root">
    <div class="form-box">
      <Form ref="formData" :model="formData" :label-width="96">
        <FormItem prop="brand" label="品牌：" class="cal-from-item">
          <Select v-model="formData.brand" @on-change='selectBrand'>
            <Option
              :value="item.code"
              v-for="item in brandList"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="business" label="业务编码：" class="cal-from-item">
          <Select v-model="formData.business">
            <Option
              :value="item.code"
              v-for="item in showBusinessList"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="businessApp" label="业务APP：" class="cal-from-item">
          <Input
            type="text"
            v-model="formData.businessApp"
            placeholder="输入业务APP"
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
        <Icon type="information-circled" class="oper-wrapper-icon" />
        <Button
          class="oper-wrapper-button"
          shape="circle"
          size="small"
          @click="showEditPopup({})"
          >添加</Button
        >
      </template>
    </page-table>
    <!-- 编辑弹窗 -->
    <Pupup v-model="editPopup.show" class-name="popup-model" width="none">
      <template slot="header"> 业务APP </template>
      <template slot="body">
        <popup-condition
          v-model="businessEditData"
          @on-ref="({ validate }) => (this.formEditValidate = validate)"
        ></popup-condition>
      </template>
      <div slot="footer" class="flex center">
        <template v-if="editPopup.data">
          <Button size="large" type="primary" @click="saveData">保存</Button>
        </template>
        <template v-else>
          <Button size="large" @click="showEditPopup({})">清空</Button>
          <Button size="large" type="primary" @click="saveData">添加</Button>
        </template>
      </div>
    </Pupup>
    <!-- 维护弹窗 -->
    <Pupup
      v-model="maintainPopup.show"
      :loading="maintainPopup.loading"
       class-name="popup-model" width="none"
    >
      <template slot="header"> 业务APP与支付产品关系 </template>
      <template slot="body">
        <div class="scroll-warp">
          <popup-condition
            v-model="maintainEditData"
            @on-ref="({ validate }) => (this.formExtEditValidate = validate)"
          ></popup-condition>
          <div class="ext-wrap">
            <div class="head">
              <Button size="small" type="primary" @click="addExtInfo">
                添加扩展信息
              </Button>
            </div>
            <div
              class="box"
              v-for="(extInfoData, idx) in extInfoList"
              :key="extInfoData.id"
            >
              <div class="flex col-center">
                <div class="flex-auto">
                  <popup-condition
                    v-model="extInfoData.data"
                    @on-ref="({ validate }) => (extInfoData.validate = validate)"
                  ></popup-condition>
                </div>
                <div class="flex center button">
                  <Button
                    size="large"
                    type="text"
                    @click="delExtInfo(extInfoData, idx)"
                  >
                    删除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div slot="footer" class="ext-footer">
        <div class="flex center">
          <template v-if="maintainPopup.extData">
            <Button size="large" type="primary" @click="saveExtData">
              保存
            </Button>
          </template>
          <template v-else>
            <Button size="large" @click="showMaintainPopup({})">清空</Button>
            <Button size="large" type="primary" @click="saveExtData">
              添加
            </Button>
          </template>
        </div>
        <div>
          <h3>支付产品明细</h3>
        </div>
        <page-table v-model="extTableData"> </page-table>
      </div>
    </Pupup>
  </div>
</template>

<script>
import commMixin from '@/mixin'
// import { copy } from '@/utils/common'
import baseApi from './business-app-management-api'

const getDefFormData = () => ({
  brand: -1,
  business: -1,
  businessApp: ''
})

const getRealFromData = formData => {
  const res = { ...formData }
  res.brand === -1 && delete res.brand
  res.business === -1 && delete res.business
  return res
}

const getDefBusinessEditData = (vm) => {
  const brandFrom = {
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
        } else if (brandFrom.oldValue !== brandFrom.value) {
          brandFrom.oldValue = brandFrom.value
          const business = businessForm.value
          const blss = vm.mixin_findBusinessListByBrandCode(value, vm.srcBusinessList)
          if (!blss.some(bs => bs.code === business)) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            businessForm.value = ''
          }
          businessForm.options = blss
        }
        callback(error)
      } }],
    options: []
  }

  const businessForm = {
    span: 11,
    prop: 'business',
    label: '业务编码：',
    component: 'Select',
    value: '',
    oldValue: '',
    rule: [{ required: true, message: '请选择业务编码', trigger: 'blur' }],
    options: []
  }

  const resForm = [
  // 第一行
    [
      brandFrom,
      { span: 2 },
      businessForm
    ],
    // 第二行
    [
      {
        span: 11,
        prop: 'businessApp',
        label: '业务APP：',
        component: 'Input',
        type: 'text',
        placeholder: '请输入业务APP',
        value: '',
        rule: [{ required: true, message: '业务APP不能为空', trigger: 'blur' }]
      },
      { span: 2 },
      {
        span: 11,
        prop: 'businessAppName',
        label: '业务APP名称：',
        component: 'Input',
        type: 'text',
        placeholder: '请输入业务APP名称',
        value: '',
        rule: [
          { required: true, message: '业务APP名称不能为空', trigger: 'blur' }
        ]
      }
    ],
    // 第三行
    [
      {
        span: 11,
        prop: 'businessManager',
        label: '业务负责人：',
        component: 'Input',
        type: 'text',
        placeholder: '请输入业务负责人',
        value: ''
      // rule: [
      //   { required: true, message: "业务负责人不能为空", trigger: "blur" },
      // ],
      },
      { span: 2 },
      {
        span: 11,
        prop: 'businessAppPrefix',
        label: '业务APP前缀：',
        component: 'Input',
        type: 'text',
        placeholder: '请输入业务APP前缀',
        value: '',
        rule: [
          { required: true, message: '业务APP前缀不能为空', trigger: 'blur' }
        ]
      }
    ],
    // 第四行
    [
      {
        span: 11,
        prop: 'signType',
        label: '签名方式：',
        component: 'Select',
        value: '',
        rule: [{ required: true, message: '请选择签名方式', trigger: 'blur' }],
        options: []
      },
      { span: 2 },
      {
        span: 11,
        prop: 'accessKey',
        label: '访问ID：',
        component: 'Input',
        type: 'textarea',
        rows: 1,
        placeholder: '请输入访问ID',
        value: ''
      // rule: [{ required: true, message: "访问ID不能为空", trigger: "blur" }],
      }
    ],
    // 第五行
    [
      {
        span: 11,
        prop: 'secretKey',
        label: '访问密钥：',
        component: 'Input',
        type: 'textarea',
        rows: 1,
        placeholder: '请输入访问密钥',
        value: ''
      // rule: [{ required: true, message: '访问密钥不能为空', trigger: 'blur' }]
      }
    ]
  ]

  return resForm
}

const getDefMaintainEditData = (vm) => {
  // const productCodeValidator = (paymentCodeList, callback) => {
  //   const error = []
  //   productCodeConfig.options = paymentCodeList.filter(v => v.portalType === portalTypeConfig.value && v.channel === payTypeConfig.value)
  //   if (portalTypeConfig.value && payTypeConfig.value && productCodeConfig.options.length <= 0) {
  //     productCodeConfig.value = ''
  //     error.push('当前终端与支付方式组合下,不存在支付产品')
  //   } else if (productCodeConfig.value && !productCodeConfig.options.some(v => v.code === productCodeConfig.value)) {
  //     productCodeConfig.value = ''
  //     error.push('请选择重新选择支付产品')
  //   }
  //   callback(error)
  // }

  const payTypeConfig = {
    span: 11,
    prop: 'channel',
    label: '支付方式：',
    component: 'Select',
    placeholder: '选择支付方式',
    value: '',
    rule: [{ required: true, message: '支付方式不能为空', trigger: 'blur' }],
    options: []
  }

  const portalTypeConfig = {
    span: 11,
    prop: 'portalType',
    label: '终端编码：',
    component: 'Select',
    placeholder: '选择终端编码',
    value: '',
    oldValue: '',
    rule: [{ required: true,
      message: '终端编码不能为空',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        // console.log('1111111111111111')
        const error = []
        if (!value) {
          error.push(rule.message)
        } else if (portalTypeConfig.oldValue !== portalTypeConfig.value) {
          portalTypeConfig.oldValue = portalTypeConfig.value
          const code = payTypeConfig.value
          const list = vm.mixin_findPayTypeListByPortalTypeAndPaymentCode({portalType: portalTypeConfig.value, paymentCode: productCodeConfig.value, payTypeList: vm.srcPayTypeList})
          if (!list.some(v => v.code === code)) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            payTypeConfig.value = ''
          }
          payTypeConfig.options = list
        }
        callback(error)
      } }],
    options: []
  }

  const productCodeConfig = {
    span: 11,
    prop: 'productCode',
    label: '支付产品编码：',
    component: 'Select',
    placeholder: '选择支付产品编码',
    value: '',
    oldValue: '',
    rule: [
      { required: true,
        message: '支付产品编码不能为空',
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const error = []
          if (!value) {
            error.push(rule.message)
          } else if (productCodeConfig.oldValue !== productCodeConfig.value) {
            productCodeConfig.oldValue = productCodeConfig.value
            const code = payTypeConfig.value
            const list = vm.mixin_findPayTypeListByPortalTypeAndPaymentCode({portalType: portalTypeConfig.value, paymentCode: productCodeConfig.value, payTypeList: vm.srcPayTypeList})
            if (!list.some(v => v.code === code)) {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              payTypeConfig.value = ''
            }
            payTypeConfig.options = list

            console.log(list)
          }
          callback(error)
        }
      }
    ],
    options: []
  }

  const validator = (rule, value, callback) => {
    const error = []
    if (
      !value &&
      ['ALI_APP1', 'ALI_WAP1', 'ALI_WEB1'].includes(payTypeConfig.value)
    ) {
      error.push(rule.message)
    }
    callback(error)
  }

  return {
    config: [
      // 第一行
      [
        {
          span: 11,
          prop: 'brand',
          label: '品牌：',
          component: 'Select',
          value: '',
          // rule: [{ required: true, message: "请选择品牌", trigger: "blur" }],
          options: [],
          disabled: true
        },
        { span: 2 },
        {
          span: 11,
          prop: 'business',
          label: '业务编码：',
          component: 'Select',
          value: '',
          // rule: [{ required: true, message: "请选择业务编码", trigger: "blur" }],
          options: [],
          disabled: true
        }
      ],
      // 第二行
      [
        {
          span: 11,
          prop: 'businessApp',
          label: '业务APP：',
          component: 'Input',
          type: 'text',
          // placeholder: "请输入业务APP",
          value: '',
          // rule: [{ required: true, message: "业务APP不能为空", trigger: "blur" }],
          options: [],
          disabled: true
        },
        { span: 2 },
        {
          span: 11,
          prop: 'appId',
          label: 'APPID',
          component: 'Input',
          type: 'text',
          placeholder: '请输入APPID',
          value: ''
        }
      ],
      // 第三行
      [ portalTypeConfig, { span: 2 }, productCodeConfig ],
      // 第四行
      [
        payTypeConfig,
        { span: 2 },
        {
          span: 11,
          prop: 'signMerNo',
          label: '签约商户号：',
          component: 'Input',
          type: 'text',
          placeholder: '请输入签约商户号',
          value: '',
          rule: [
            {
              required: false,
              message: '当前支付方式下,签约商户号不能为空',
              trigger: 'blur',
              validator
            }
          ]
        }
      ],
      // 第五行
      [
        {
          span: 11,
          prop: 'signAppId',
          label: '签约APPID：',
          component: 'Input',
          type: 'text',
          placeholder: '请输入签约APPID',
          value: '',
          rule: [
            {
              required: false,
              message: '当前支付方式下,签约APPID不能为空',
              trigger: 'blur',
              validator
            }
          ]
        },
        { span: 2 }
      ]
    ],
    payTypeConfig,
    portalTypeConfig
    // productCodeValidator

    // setPaymentCodeList (list, vue) {
    //   data.paymentCodeList = copy(list) || []
    //   productCodeConfig.options = data.paymentCodeList
    //   data.vue = vue
    // }
  }
}

const getDefExtInfo = () => ({
  id: Math.random(),
  data: [
    [
      {
        span: 11,
        prop: 'cfgKey',
        label: '配置key：',
        component: 'Input',
        type: 'text',
        value: '',
        rule: [{ required: true, message: '配置key不能为空', trigger: 'blur' }]
      },
      { span: 2 },
      {
        span: 11,
        prop: 'cfgValue',
        label: '配置值：',
        component: 'Input',
        type: 'text',
        value: '',
        rule: [{ required: true, message: '配置值不能为空', trigger: 'blur' }]
      }
    ],
    [
      {
        span: 24,
        prop: 'remark',
        label: '说明：',
        component: 'Input',
        type: 'textarea',
        rows: 2,
        value: ''
        // rule: [{ required: true, message: "配置值不能为空", trigger: "blur" }],
      }
    ]
  ]
})

export default {
  name: 'businessAppManagement',
  mixins: [commMixin],
  data () {
    return {
      observableData: {},
      businessEditData: [],
      maintainEditData: [],
      extInfoList: [],
      editPopup: {
        show: false,
        data: null
      },
      maintainPopup: {
        show: false,
        data: null,
        loading: false
      },
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
              title: '业务APP',
              key: 'businessApp',
              // align: 'center',
              minWidth: 100

            },
            {
              title: '业务APP名称',
              key: 'businessAppName',
              minWidth: 100
              // align: 'center',

            },
            {
              title: '业务负责人',
              key: 'businessManager',
              minWidth: 156
              // align: 'center',

            },
            {
              title: '业务编码',
              key: 'business',
              minWidth: 100
              // align: 'center',

            },
            {
              title: '业务APP前缀',
              key: 'businessAppPrefix',
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
              title: '访问ID',
              key: 'accessKey',
              // align: 'center',
              ellipsis: true

              // render: (h, params) => {
              //   return h('Tooltip', {
              //     props: {
              //       content: params.row[params.column.key],
              //       placement: 'top'
              //     }
              //   }, params.row[params.column.key])
              // }
            },
            {
              title: '访问秘钥',
              key: 'secretKey',
              // align: 'center',
              ellipsis: true

            },
            {
              title: '操作',
              key: 'reason',
              // align: 'center',
              width: 155,
              render: (h, params) => {
                return [
                  h(
                    'a',
                    {
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
                      style: {
                        color: '#169BD5',
                        margin: 'auto 10px'
                      },
                      on: {
                        click: () => {
                          // 显示维护弹窗
                          this.showMaintainPopup(params)
                        }
                      }
                    },
                    '产品关系维护'
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
              title: '业务APP',
              key: 'businessApp'
              // align: 'center',

            },
            {
              title: 'APPID',
              key: 'appId'
              // align: 'center',

            },
            {
              title: '终端编码',
              key: 'portalType'
              // align: 'center',

            },
            {
              title: '支付产品编码',
              key: 'productCode'
              // align: 'center',

            },
            {
              title: '业务负责人',
              key: 'businessManager'
              // align: 'center',

            },
            {
              title: '签约商户号',
              key: 'signMerNo'
              // align: 'center',

            },
            {
              title: '签约APPID',
              key: 'signAppId'
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
      },
      formData: getDefFormData(),
      currentOptions: {}
    }
  },
  computed: {
    showBusinessList () {
      const {business} = this.formData
      const blss = this.mixin_findBusinessListByBrandCode(this.formData.brand || {})
      if (!blss.some(bs => bs.code === business)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formData.business = getDefFormData().business
      }
      return blss
    }
  },
  // watch: {
  //   'observableData.payTypeConfig.value' (val) {
  //     this.observableData.productCodeValidator(this.srcPaymentCodeList, (error) => {
  //       (error || []).length > 0 && this.$Message.warning(error[0])
  //     })
  //   },
  //   'observableData.portalTypeConfig.value' (val) {
  //     this.observableData.productCodeValidator(this.srcPaymentCodeList, (error) => {
  //       (error || []).length > 0 && this.$Message.warning(error[0])
  //     })
  //   }
  // },
  created () {
    this.currentOptions = this.$copy(this.formData)
    this.mixin_queryFormBrandList()
    this.mixin_queryFormBusinessList()
    this.mixin_queryFormSignTypeList()
    this.mixin_queryFormPortalTypeList()
    this.mixin_queryFormPaymentCodeList()
    this.mixin_queryFromNewPayTypeList()
    this.queryData()
  },
  mounted () {},
  beforeDestroy () {},
  methods: {
    selectBrand (e) { // 根据品牌选择业务编码
      // console.log(e,this.formData.brand)
      // this.mixin_queryFormBusinessList({id: this.formData.brand})
    },
    showEditPopup ({ row, column, index }) {
      const businessEditData = getDefBusinessEditData(this)

      console.log('businessEditData', businessEditData)
      this.$ArrayObjectEach(businessEditData, v => {
        let value
        if (v && v.component) {
          // 添加不存在 row
          row && (value = row[v.prop]) && (v.value = value)
          switch (v.prop) {
            case 'brand':
              v.options = this.srcBrandList
              break
            case 'business':
              v.options = this.srcBusinessList
              break
            case 'signType':
              v.options = this.srcSignTypeList
              break
            case 'businessApp':
              if (row) {
                v.disabled = true
                v.rule = []
              }
              break
            default:
              break
          }
        }
      })
      this.businessEditData = businessEditData
      this.editPopup.show = true
      this.editPopup.data = row
    },
    delData ({ row, column, index }) {
      baseApi
        .delBusinessData({ id: row.id })
        .then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success(`操作成功`)
            this.queryData()
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch(err => {
        //   this.$Message.error(`操作失败！${err.message}`)
          console.log(err)
        })
    },
    saveData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          if (this.editPopup.data) {
            params.id = this.editPopup.data.id
          }
          baseApi
            .updateBusinessData(params)
            .then(({ data }) => {
              if (data.code === 200) {
                this.editPopup.show = false
                this.$Message.success(`保存成功`)
                this.queryData()
              } else {
                return Promise.reject(new Error(data.msg))
              }
            })
            .catch(err => {
              this.$Message.error(`操作失败！${err.message}`)
              console.log(err)
            })
        }
      })
    },
    saveExtData () {
      this.formExtEditValidate((valid, params) => {
        if (valid) {
          // 扩展属性验证
          let proms =
            this.extInfoList && this.extInfoList.map(e => e.validate())
          if (!proms || proms.length <= 0) {
            proms = [Promise.resolve({ valid: true })]
          }
          Promise.all(proms).then(ress => {
            if (ress.some(({ valid }) => !valid)) {
              return
            }
            const extList = ress
              .filter(({ params: prms }) => prms)
              .map(({ params: prms }) => prms)
            const reqPrm = {
              ...params,
              list: extList
            }
            if (this.maintainPopup.extData) {
              reqPrm.id = this.maintainPopup.extData.id
            }
            baseApi
              .updateExtProductMaintenance(reqPrm)
              .then(({ data }) => {
                if (data.code === 200) {
                  this.showMaintainPopup({ row: this.maintainPopup.data })
                  this.$Message.success(`保存成功`)
                } else {
                  return Promise.reject(new Error(data.msg))
                }
              })
              .catch(err => {
                this.$Message.error(`操作失败！${err.message}`)
                console.log(err)
              })
          })
        }
      })
    },
    showMaintainPopup ({ row, column, index }) {
      const isClean = !row
      !row && (row = this.maintainPopup.data)
      const {
        config: maintainEditData
        // payTypeConfig,
        // portalTypeConfig,
        // productCodeValidator
      } = getDefMaintainEditData(this)
      this.$ArrayObjectEach(maintainEditData, v => {
        let value
        if (v && v.component) {
          (value = row[v.prop]) && (v.value = value)
          switch (v.prop) {
            case 'brand':
              v.options = this.srcBrandList
              break
            case 'business':
              v.options = this.srcBusinessList
              break
            case 'portalType':
              v.options = this.srcPortalTypeList
              break
            case 'channel':
              v.options = this.srcPayTypeList
              break
            case 'productCode':
              v.options = this.srcPaymentCodeList
              // setPaymentCodeList(this.srcPaymentCodeList, this)
              break
            default:
              break
          }
        }
      })
      // this.$set(this, 'observableData', {
      //   payTypeConfig,
      //   portalTypeConfig,
      //   productCodeValidator
      // })
      // this.productCodeValidator = productCodeValidator
      this.maintainEditData = maintainEditData
      this.maintainPopup.show = true
      this.maintainPopup.extData = null
      this.extInfoList = []
      if (!isClean) {
        this.maintainPopup.data = row
        this.queryExtTable()
      }
    },
    editExtData ({ row, column, index }) {
      this.maintainPopup.loading = true
      baseApi
        .getExtProductDetails({ id: row.id })
        .then(({ data }) => {
          if (data.code === 200) {
            if (data.data) {
              this.$ArrayObjectEach(this.maintainEditData, v => {
                if (v && v.component && v.prop in data.data) {
                  v.value = data.data[v.prop]
                }
              })
              this.extInfoList = (data.data.list || []).map(item => {
                const extinfo = getDefExtInfo()
                this.$ArrayObjectEach(extinfo.data, v => {
                  if (v && v.component && v.prop in item) {
                    v.value = item[v.prop]
                  }
                })
                return extinfo
              })
              this.maintainPopup.extData = data.data
            }
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch(err => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.maintainPopup.loading = false
        })
    },
    delExtData ({ row, column, index }) {
      baseApi
        .delExtBusinessData({ id: row.id })
        .then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success(`操作成功`)
            this.showMaintainPopup({ row: this.maintainPopup.data })
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch(err => {
          this.$Message.error(`操作失败！${err.message}`)
          console.log(err)
        })
    },
    addExtInfo () {
      const extinfo = getDefExtInfo()
      this.extInfoList.push(extinfo)
    },
    delExtInfo (extInfo, idx) {
      this.extInfoList.splice(idx, 1)
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
    queryExtTable () {
      this.extTableData.loading = true
      baseApi
        .getExtBusinessTable({ id: this.maintainPopup.data.id })
        .then(({ data }) => {
          if (data.code === 200) {
            if (data.data && data.data.list) {
              this.extTableData.table.data = data.data.list
            }
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch(err => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.extTableData.loading = false
        })
    },
    /**
     * 查询列表
     */
    queryData () {
      this.tableData.loading = true
      baseApi
        .queryBusinessTable({
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
        .catch(err => {
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

<style lang="less" src="./business-app-management.less" scoped></style>
