<template>
  <Pupup
    v-model="popup.show"
    :loading="popup.loading"
    class-name="popup-model"
    width="none"
  >
    <template slot="header"> 餐厅扩展导入 </template>
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
        <template>
          <Button size="large" type="primary" @click="saveExtData">
            确定
          </Button>
          <Button size="large" @click="popup.show = false">取消</Button>
        </template>
      </div>
    </div>
  </Pupup>
</template>

<script>
import baseApi from '../vpay-unionpay-management-api'
const getDefEditData = () => {
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
      }
    ],
    [
      {
        span: 20,
        prop: 'file',
        label: '导入文件：',
        component: () => import('./file-info'),
        value: '',
        rule: [{ required: true,
          message: '请选择文件',
          trigger: 'blur',
          validator: (rule, value, callback) => {
            const error = []
            if ((!value || !value.name)) {
              error.push(rule.message)
            }
            callback(error)
          }
        }],
        options: []
      }
      // { span: 1 },
      // {
      //   span: 11,
      //   prop: 'channel',
      //   label: '支付方式：',
      //   component: 'Select',
      //   value: '',
      //   rule: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
      //   options: []
      // }
    ]
  ]
}

const getDefPopup = () => ({
  show: false,
  data: null,
  loading: false
})
export default {
  data () {
    return {
      popup: getDefPopup(),
      editData: [],
      canClick: true
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
        srcBrandList
        // srcPayTypeList,
        // srcSignTypeList,
        // 默认是编辑状态
        // isEdit = true
      } = this.popup.srcData[1]
      const isClean = !row
      !row && (row = this.popup.data || {})
      const editData = getDefEditData()
      this.$ArrayObjectEach(editData, (v) => {
        let value
        if (v && v.component) {
          (value = row[v.prop]) && (v.value = value)
          v.disabled = !!row.isFranchisees
          switch (v.prop) {
            case 'brand':
              v.options = srcBrandList
              break
            // case 'channel':
            //   v.options = srcPayTypeList
            //   break
            // case 'appId':
            //   v.disabled = isEdit
            //   break
            // case 'signType':
            //   v.options = srcSignTypeList
            //   break
            default:
              break
          }
        }
      })
      this.editData = editData
      this.popup.show = true
      this.popup.extData = !row.isFranchisees
      if (!isClean) {
        this.popup.data = row
      }
    },
    saveExtData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          // this.$Message.info('餐厅扩展导入，请耐心等待，期间不要关闭界面', 100)
          if (!this.canClick) {
            return
          }
          this.canClick = false
          this.popup.loading = true
          const reqPrm = {
            ...params
          }
          baseApi
            .uploadStoreExtInfo(reqPrm)
            .then(({ data }) => {
              if (data.code === 200) {
                const callback = this.popup.srcData[1].callback
                callback && callback()
                this.$Modal.success({
                  title: '温馨提示',
                  content: '餐厅扩展导入成功',
                  onOk: () => {
                    this.popup.loading = false
                    this.popup.show = false
                    this.canClick = true
                  }
                })
                // this.$Message.success(`保存成功`)
                // this.popup.loading = false
                // this.popup.show = false
              } else {
                this.$Modal.error({
                  title: '温馨提示',
                  content: `操作失败！${data.msg}`,
                  onOk: () => {
                    this.popup.loading = false
                    this.canClick = true
                    // this.popup.show = false
                  }
                })
                // return Promise.reject(new Error(data.msg))
              }
            })
            .catch((err) => {
              // this.$Message.error(`操作失败！${err.message}`)
              // this.popup.loading = false
              this.$Modal.error({
                title: '温馨提示',
                content: `操作失败！${err.message}`,
                onOk: () => {
                  this.popup.loading = false
                  this.canClick = true
                }
              })
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
