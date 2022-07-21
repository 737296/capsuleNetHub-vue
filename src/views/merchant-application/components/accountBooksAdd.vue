<template>
  <Pupup v-model="popup.show"
         :loading="popup.loading"
         class-name="popup-model"
         width="none">
    <template slot="header"> 电子账簿添加 </template>
    <template slot="body">
      <div class="scroll-warp">
        <popup-condition v-model="editData"
                         @on-ref="({ validate }) => (this.formEditValidate = validate)"></popup-condition>

      </div>
    </template>
    <div slot="footer"
         class="ext-footer">
      <div class="flex center">
        <template v-if="popup.extData">
          <Button size="large"
                  type="primary"
                  @click="saveExtData">
            保存
          </Button>
        </template>
        <template v-else>
          <Button size="large"
                  @click="_showPopup({})">清空</Button>
          <Button size="large"
                  type="primary"
                  @click="saveExtData">
            添加
          </Button>
        </template>
      </div>
    </div>
  </Pupup>
</template>

<script>
import baseApi from '../application-api'
const getDefEditData = () => {
  return [
    [
      {
        span: 11,
        prop: 'account',
        label: '法人编号',
        component: 'Input',
        placeholder: '请输入法人编号',
        value: this.legalCode,
        rule: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'phone',
        label: '手机号：',
        component: 'Input',
        placeholder: '请输入手机号',
        value: '',
        // rule: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'email',
        label: '邮箱：',
        component: 'Input',
        placeholder: '请输入邮箱',
        value: '',
        // rule: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'list',
        label: '分配角色：',
        component: 'Select',
        multiple: true,
        value: [],
        rule: [{
          required: true,
          message: '请选择分配角色',
          trigger: 'blur',
          validator: (rule, value, callback) => {
            const error = []
            if (!value || value.length <= 0) {
              error.push(rule.message)
            }
            callback(error)
          }
        }],
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'adId',
        label: 'AD_ID：',
        component: 'Input',
        placeholder: '请输入AD_ID',
        value: '',
        rule: [{ required: true, message: '请输入AD_ID', trigger: 'blur' }],
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'enableFlag',
        label: '状态：',
        component: 'Select',
        value: '',
        rule: [{ required: true, message: '请选择状态', trigger: 'blur' }],
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
export default {
  data () {
    return {
      popup: getDefPopup(),
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
        srcRoleList,
        srcStateList,
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
            case 'enableFlag':
              v.value = value !== false ? 'true' : 'false'
              v.options = srcStateList
              break
            case 'list':
              v.options = srcRoleList
              break
            // case 'account':
            //   v.disabled = isEdit
            //   break
            default:
              break
          }
        }
      })
      this.editData = editData
      this.popup.show = true
      this.popup.extData = isEdit
      if (!isClean) {
        this.popup.data = row
      }
    },
    saveExtData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          const reqPrm = {
            ...params,
            enableFlag: params.enableFlag === 'true'
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
        }
      })
    }
  }
}
</script>

<style>
</style>
