<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Pupup v-model="popup.show" :loading="popup.loading" class-name="popup-model" width="none" >
    <template slot="header"> 微信-商户号 </template>
    <template slot="body">
      <div class="scroll-warp">
        <popup-condition
          v-model="editData"
          @on-ref="({ validate }) => (this.formEditValidate = validate)"
        ></popup-condition>
        <certificate-info v-model="certFile.path" :fileName.sync="certFile.name"/>
        <MerchantKeyInfo v-model="merchantKeyFile.path" :fileName.sync="merchantKeyFile.name"/>
        <WxCertInfo v-model="wxCertFile.path" :fileName.sync="wxCertFile.name"/>
        <Row type="flex" justify="center" align="middle" class="mt-10">
          <Col span="23" class="font-title"> 财务拓展信息 </Col>
        </Row>
        <popup-condition
          v-model="editOtherData"
          :label-width="120"
          @on-ref="({ validate }) => (this.formEditOtherValidate = validate)"
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
import debounce from 'lodash/debounce'
import baseApi from '../weapp-merchant-management-api'
const getDefEditData = () => [
  [
    {
      span: 11,
      prop: 'brand',
      label: '品牌：',
      component: 'Select',
      value: '',
      rule: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
      options: []
    },
    { span: 1 },
    {
      span: 11,
      prop: 'merchantNo',
      label: '商户号：',
      component: 'Input',
      placeholder: '请输入商户号',
      value: '',
      rule: [{ required: true, message: '请输入商户号', trigger: 'blur' }],
      options: []
    }
  ],
  [
    {
      span: 11,
      prop: 'companyName',
      label: '法人公司名：',
      component: 'Input',
      placeholder: '请输入法人公司名',
      value: '',
      rule: [{ required: true, message: '请输入法人公司名', trigger: 'blur' }],
      options: []
    },
    { span: 1 },
    {
      span: 11,
      prop: 'isFranchisees',
      label: '归属：',
      component: 'Select',
      value: null,
      rule: [
        {
          required: true,
          message: '请选择归属',
          trigger: 'blur',
          validator: (rule, value, callback) => {
            const error = []
            if (value !== 'false' && value !== 'true') {
              error.push(rule.message)
            }
            callback(error)
          }
        }
      ],
      options: [
        {
          code: 'false',
          name: '直营'
        },
        {
          code: 'true',
          name: '加盟'
        }
      ]
    }
  ],
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
    { span: 1 },
    {
      span: 11,
      prop: 'privateKey',
      label: '商户私钥：',
      component: 'Input',
      type: 'textarea',
      rows: 1,
      placeholder: '请输入商户私钥',
      value: '',
      rule: [{ required: true, message: '请输入商户私钥', trigger: 'blur' }],
      options: []
    },
    {
      span: 11,
      prop: 'merchantSerialNumber',
      label: '商户证书序列号：',
      component: 'Input',
      type: 'textarea',
      rows: 1,
      placeholder: '请输入商户证书序列号',
      value: '',
      rule: [{ required: true, message: '请输入商户证书序列号', trigger: 'blur' }],
      options: []
    }
  ]
]

const getOtherDefEditData = () => {
  const rateConfig = {
    span: 11,
    prop: 'rate',
    label: '费率：',
    component: 'Input',
    placeholder: '0%',
    value: '',
    options: [],
    rule: [
      {
        required: false,
        message: '请输入百分比',
        // eslint-disable-next-line no-useless-escape
        reg: /^\d+[\.]?\d*%$/,
        setValue: debounce((value) => (rateConfig.value = value), 200),
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const error = []
          if (value) {
            value[value.length - 1] !== '%' && (value += '%')
            if (!rule.reg.test(value)) {
              error.push(rule.message)
            } else {
              rule.setValue(value)
            }
          }
          callback(error)
        }
      }
    ]
  }
  const now = new Date()
  now.setDate(now.getDate() - 1)
  const nextDay = new Date()
  nextDay.setDate(nextDay.getDate() + 1)
  return [
    [
      {
        span: 11,
        prop: 'merchantCatalog',
        label: '账号分类：',
        component: 'Input',
        placeholder: 'XX网支',
        value: '',
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'signMerchantNo',
        label: '签约商户号：',
        component: 'Input',
        placeholder: '请输入商户号',
        value: '',
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'binder',
        label: '绑定人：',
        component: 'Input',
        placeholder: '绑定人信息',
        value: '',
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'binderMobile',
        label: '绑定人手机号：',
        component: 'Input',
        placeholder: '请输入绑定人手机号',
        value: '',
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'binderEmail',
        label: '绑定人邮箱：',
        component: 'Input',
        placeholder: '请输入绑定人邮箱',
        value: '',
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'applyScene',
        label: '应用场景：',
        component: 'Input',
        placeholder: '肯德基外送/肯德基宅急送（自有平台）',
        value: '',
        options: []
      }
    ],
    [
      rateConfig,
      { span: 1 },
      {
        span: 11,
        prop: 'bindingBankAccount',
        label: '绑定银行账户：',
        component: 'Input',
        placeholder: '请输入银行账户名称',
        value: '',
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'bindingBankAccountName',
        label: '绑定银行账户名称：',
        component: 'Input',
        placeholder: '请输入银行账户名称',
        value: '',
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'settlementBankAccount',
        label: '结算银行账户：',
        component: 'Input',
        placeholder: '请输入银行账户',
        value: '',
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'settlementBankAccountName',
        label: '结算银行账户名称：',
        component: 'Input',
        placeholder: '请输入银行账户名称',
        value: '',
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'apiExpireTime',
        label: 'API到期时间：',
        placeholder: '请选择到期时间',
        component: 'DatePicker',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        placement: 'top-end',
        options: {
          disabledDate (dt) {
            return dt.getTime() < now
          }
        },
        value: ''
      }
    ],
    [
      {
        span: 11,
        prop: 'merchantOpenDay',
        label: '账号开立的年月：',
        placeholder: '请选择年月',
        component: 'DatePicker',
        type: 'month',
        format: 'yyyy-MM',
        placement: 'top-end',
        value: ''
      },
      { span: 1 },
      {
        span: 11,
        prop: 'merchantStatus',
        label: '状态：',
        component: 'Input',
        placeholder: '请输入状态',
        value: '',
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'merchantType',
        label: '账号类型：',
        component: 'Input',
        placeholder: '请输入账号类型',
        value: '',
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'transferRate',
        label: '银行打款频次：',
        component: 'Input',
        placeholder: '请输入银行打款频次',
        value: '',
        options: []
      }
    ],
    [
      {
        span: 23,
        prop: 'billSource',
        label: '账单来源：',
        component: 'Input',
        placeholder: '请输入账单来源',
        value: '',
        options: []
      }
    ]
  ]
}

const getDefPopup = () => ({
  show: false,
  data: null,
  loading: false
})
const getDefCertData = () => ({
  name: '',
  path: null
})
const getDefCertData2 = () => ({
  name: '',
  path: null
})
const getDefCertData3 = () => ({
  name: '',
  path: null
})
export default {
  components: {
    CertificateInfo: (resolve) =>
      require(['./weapp-certificate-info.vue'], resolve),
    MerchantKeyInfo: (resolve) =>
      require(['./weapp-merchant-key-info.vue'], resolve),
    WxCertInfo: (resolve) =>
      require(['./weapp-wx-cert-info.vue'], resolve)
  },
  data () {
    return {
      popup: getDefPopup(),
      editData: [],
      editOtherData: [],
      certFile: getDefCertData(),
      merchantKeyFile: getDefCertData2(),
      wxCertFile: getDefCertData3()
    }
  },
  methods: {
    showPopup (...params) {
      this.popup = getDefPopup()
      this.popup.srcData = params
      console.log(params)
      this._showPopup(...params)
    },
    _showPopup ({ row, column, index }) {
      const {
        srcBrandList,
        // 默认是编辑状态
        isEdit = true
      } = this.popup.srcData[1]
      const isClean = !row

      const promise =
        isEdit && !isClean
          ? baseApi
            .getDetails({
              channel: 'WXPAY',
              merchantNo: row.merchantNo
            })
            .then(({ data }) => {
              if (data.code === 200 || data.code === '200') {
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
          : Promise.resolve(row)

      promise.then((row) => {
        !row && (row = this.popup.data || {})
        const editData = getDefEditData()
        this.$ArrayObjectEach(editData, (v) => {
          let value
          if (v && v.component) {
            (value = row[v.prop]) && (v.value = value)
            switch (v.prop) {
              case 'brand':
                v.options = srcBrandList
                break
              case 'signType':
                v.value = 'MD5'
                v.options = [{ code: 'MD5', name: 'MD5' }]
                v.disabled = true
                break
              case 'merchantNo':
                v.disabled = isEdit
                break
              case 'isFranchisees':
                v.value = String(value)
                break
              case 'apiExpireTime':
                v.value = String(value)
                break
              default:
                break
            }
          }
        })
        this.editData = editData

        const editOtherData = getOtherDefEditData()
        this.$ArrayObjectEach(editOtherData, (v) => {
          let value
          if (v && v.component) {
            (value = row[v.prop]) && (v.value = value)
            // switch (v.prop) {
            //   case "brand":
            //     v.options = srcBrandList;
            //     break;
            //   case "channel":
            //     v.options = srcPayTypeList;
            //     break;
            //   case "appId":
            //     v.disabled = isEdit;
            //     break;
            //   case "signType":
            //     v.value = "RSA";
            //     v.options = [{ code: "RSA", name: "RSA" }];
            //     v.disabled = true;
            //     break;
            //   default:
            //     break;
            // }
          }
        })
        this.editOtherData = editOtherData
        this.popup.show = true
        this.popup.extData = isEdit
        console.log(row)
        // 证书文件
        if (isEdit && row.certFiles) {
          try {
            const certFiles = JSON.parse(row.certFiles)
            console.log(certFiles)
            this.certFile = certFiles['refund']
            this.merchantKeyFile = certFiles['v3PrivateKey']
            this.wxCertFile = certFiles['v3WxCert']
            // this.certFile = Object.keys(certFiles).reduce((sum, key) => Object.assign(sum, {
            //   ...certFiles[key]
            // }), {})
            console.log(this.merchantKeyFile)
          } catch (error) {
            this.certFile = getDefCertData()
            this.merchantKeyFile = getDefCertData2()
            this.wxCertFile = getDefCertData3()
            console.log(error)
          }
        } else {
          this.certFile = getDefCertData()
          this.merchantKeyFile = getDefCertData2()
          this.wxCertFile = getDefCertData3()
        }
        if (!isClean) {
          this.popup.data = row
        }
      })
    },
    saveExtData () {
      if (!this.certFile) {
        this.$Message.warning(`请上传证书文件`)
        return
      }
      if (!this.merchantKeyFile) {
        this.$Message.warning(`请上传商户私钥证书`)
        return
      }
      if (!this.wxCertFile) {
        this.$Message.warning(`请上微信平台证书`)
        return
      }
      this.formEditValidate((valid, params) => {
        if (valid) {
          this.formEditOtherValidate((valid2, params2) => {
            if (valid2) {
              if (!this.certFile.path) {
                this.certFile.name = `<span style="color: red;">请选择证书文件</span>`
                return
              }
              const reqPrm = {
                ...params,
                ...params2,
                merchantOpenDay: (params2.merchantOpenDay || '').length === 7 ? params2.merchantOpenDay + '-01 00:00:00' : params2.merchantOpenDay,
                certFiles: JSON.stringify({
                //   [params.merchantNo]: {
                  'refund': {
                    ...this.certFile,
                    pwd: params.merchantNo
                  },
                  'v3PrivateKey': {
                    ...this.merchantKeyFile,
                    pwd: params.merchantNo
                  },
                  'v3WxCert': {
                    ...this.wxCertFile,
                    pwd: params.merchantNo
                  }
                }),
                isFranchisees: params.isFranchisees === 'true',
                rate: params2.rate ? Number.parseFloat(params2.rate) : null
              }
              if (this.popup.extData) {
                reqPrm.merId = this.popup.data.merId
                reqPrm.extId = this.popup.data.extId
              } else {
                reqPrm.channel = 'WXPAY'
              }
              baseApi
                .updateData(reqPrm, { isEdit: this.popup.extData })
                .then(({ data }) => {
                  if (data.code === 200 || data.code === '200') {
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
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mt-10 {
  margin-top: 15px;
  margin-bottom: 10px;
}
.font-title {
  font-size: 16px;
  font-weight: 700;
  color: #ed3f14;
}
.scroll-warp {
  max-height: 600px;
  overflow: hidden;
  overflow-y: auto;
}
</style>
