<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Pupup v-model="popup.show" :loading="popup.loading" class-name="popup-model" width="none">
    <template slot="header"> 支付APP秘钥维护 </template>
    <template slot="body">
      <div class="scroll-warp">
        <CertificateTips/>
        <popup-condition
          v-model="editData"
          @on-ref="({ validate }) => (this.formEditValidate = validate)"
        ></popup-condition>
        <!-- <Row class="title-border">
          <Col :span="1">&nbsp;</Col>
          <Col :span="23">
            <h3 class="certificate-title">证书信息</h3>
          </Col>
        </Row>
        <div class="certificate-info">
          <popup-condition
            v-model="editCertificateData"
            @on-ref="
              ({ validate }) => (this.formEditCertificateValidate = validate)
            "
          ></popup-condition>
          <certificate-info v-model="certFile" />
        </div> -->
        <div class="ext-wrap">
          <div class="head">
            <Button size="small" type="primary" @click="addExtInfo">
              添加证书
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
                <certificate-info
                  v-model="extInfoData.fileInfo.path"
                  :fileName.sync="extInfoData.fileInfo.name"
                />
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
import baseApi from '../app-secret-management-api'
const getDefEditData = () => {
  const signTypeConfig = {
    span: 11,
    prop: 'signType',
    label: '签名方式：',
    component: 'Select',
    value: '',
    rule: [{ required: true, message: '请选择签名方式', trigger: 'blur' }],
    options: []
  }

  return [
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
        prop: 'appId',
        label: 'APPID：',
        component: 'Input',
        placeholder: '请输入APPID',
        value: '',
        rule: [{ required: true, message: '请输入APPID', trigger: 'blur' }],
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'appName',
        label: 'APP名称：',
        component: 'Input',
        placeholder: '请输入APP名称',
        value: '',
        rule: [{ required: true, message: '请输入APP名称', trigger: 'blur' }],
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'channel',
        label: '支付方式：',
        component: 'Select',
        value: '',
        rule: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
        options: []
      }
    ],
    [
      signTypeConfig,
      { span: 1 },
      {
        span: 11,
        prop: 'privateKey',
        label: 'APP私钥：',
        component: 'Input',
        type: 'textarea',
        rows: 1,
        placeholder: '请输入APP私钥',
        value: '',
        rule: [{ required: true, message: '请输入APP私钥', trigger: 'blur' }],
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'publicKey',
        label: 'APP公钥：',
        component: 'Input',
        type: 'textarea',
        rows: 1,
        placeholder: '请输入APP公钥',
        value: '',
        // rule: [
        //   {
        //     required: false,
        //     message: '请输入APP公钥',
        //     trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       const error = []
        //       if (!value && ['RSA', 'RSA2'].includes(signTypeConfig.value)) {
        //         error.push(rule.message)
        //       }
        //       callback(error)
        //     }
        //   }
        // ],
        options: []
      }
    ]
  ]
}

const getDefExtInfo = () => {
  return {
    id: Math.random(),
    fileInfo: {
      name: '',
      path: null
    },
    data: [
      [
        {
          span: 11,
          prop: 'type',
          label: '证书类型：',
          component: 'Input',
          placeholder: '请输入证书类型',
          value: '',
          rule: [{ required: true, message: '请输入证书类型', trigger: 'blur' }],
          options: []
        },
        { span: 1 },
        {
          span: 11,
          prop: 'pwd',
          label: '证书密码：',
          component: 'Input',
          type: 'password',
          placeholder: '请输入证书密码',
          value: '',
          rule: [{ required: true, message: '请输入证书密码', trigger: 'blur' }],
          options: []
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
  components: {
    CertificateInfo: () => import('./certificate-info'),
    CertificateTips: () => import('./certificate-tips')
  },
  data () {
    return {
      popup: getDefPopup(),
      editData: [],
      extInfoList: []
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
        srcSignTypeList,
        // 默认是编辑状态
        isEdit = true
      } = this.popup.srcData[1]
      const isClean = !row
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
            case 'channel':
              v.options = srcPayTypeList
              break
            case 'appId':
              v.disabled = isEdit
              break
            case 'signType':
              v.options = srcSignTypeList
              break
            default:
              break
          }
        }
      })

      const extInfoList = []
      // 证书文件
      if (isEdit && row.certFiles) {
        try {
          const cfs = JSON.parse(row.certFiles)
          Object.keys(cfs).forEach((key) => {
            const cf = cfs[key]
            cf.type = key
            const editCertificateData = getDefExtInfo()
            editCertificateData.fileInfo = cf
            this.$ArrayObjectEach(editCertificateData.data, (v) => {
              let value
              if (v && v.component) {
                (value = cf[v.prop]) && (v.value = value)
              }
            })
            extInfoList.push(editCertificateData)
          })
        } catch (error) {
          console.log(error)
        }
      }

      this.editData = editData
      this.extInfoList = extInfoList
      this.popup.show = true
      this.popup.extData = isEdit
      if (!isClean) {
        this.popup.data = row
      }
    },
    saveExtData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          // 扩展属性验证
          let proms =
            this.extInfoList && this.extInfoList.map(e => e.validate().then(({valid, params}) => {
              if (valid) {
                if (e.fileInfo.path) {
                  params = {
                    ...params,
                    fileInfo: e.fileInfo
                  }
                } else {
                  e.fileInfo.name = `<span style="color: red;">请选择证书文件</span>`
                  valid = false
                }
              }

              return Promise.resolve({valid, params})
            }))
          if (!proms || proms.length <= 0) {
            proms = [Promise.resolve({ valid: true })]
          }

          Promise.all(proms).then(ress => {
            if (ress.some(({ valid }) => !valid)) {
              return
            }
            const extList = ress
              .filter(({ params: prms }) => prms)
              .map(({ params: prms }) => ({
                [prms.type]: {
                  ...prms.fileInfo,
                  pwd: prms.pwd
                }
              })).reduce((sum, val) => {
                Object.assign(sum, val)
                return sum
              }, {})
            const reqPrm = {
              ...params,
              certFiles: JSON.stringify(extList)
            }
            if (this.popup.extData) {
              reqPrm.id = this.popup.data.id
            }
            baseApi
              .updateData(reqPrm, { isEdit: this.popup.extData })
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
          })
        }
      })
    },
    addExtInfo () {
      const extinfo = getDefExtInfo()
      this.extInfoList.push(extinfo)
    },
    delExtInfo (extInfo, idx) {
      this.extInfoList.splice(idx, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  background-color: #f0f0f0;
  margin: 10px 0px;
  padding: 24px 0px 0px;
  > .button {
    width: 68px;
  }
}
</style>
