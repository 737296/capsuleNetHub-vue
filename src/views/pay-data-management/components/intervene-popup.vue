<template>
  <Pupup v-model="popup.show" :loading="popup.loading" class-name="popup-model" width="none">
    <template slot="header"> 退单风控干预 </template>
    <template slot="body">
      <div class="scroll-warp">
        <popup-condition
          v-model="editData"
          @on-ref="({ validate }) => (this.formEditValidate = validate)"
        ></popup-condition>
        <Form ref="originFrom" :label-width="96">
          <FormItem label="干预原因：" class="cal-from-item">
            <Input
              type="text"
              v-model="interventionDesc"
            />
        </FormItem>
        </Form>
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
          <Button size="large" @click="popup.show = false">取消</Button>
          <Button size="large" type="primary" @click="saveExtData">
            确定
          </Button>
        </template>
      </div>
    </div>
  </Pupup>
</template>

<script>
import baseApi from '../pay-abnormal-list-api'
const getDefEditData = () => {
  const typeConfig1 = {
    span: 11,
    prop: 'type',
    // label: '按业务整体干预（允许退单）',
    component: 'Radio',
    content: '按业务整体干预（允许退单）',
    value: true,
    'on-change' (val) {
      typeConfig1.value = val
      typeConfig2.value = !val

      businessConfig.value = ''
      updateDataConfig.hidden = val
      businessConfig.hidden = !val
    }
    // rule: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
    // options: []
  }

  const typeConfig2 = {
    span: 11,
    prop: 'type_bak',
    // label: '部分干预（拒绝退单）',
    component: 'Radio',
    content: '部分干预（拒绝退单）',
    value: false,
    'on-change' (val) {
      typeConfig1.value = !val
      typeConfig2.value = val

      updateDataConfig.value = ''
      updateDataConfig.hidden = !val
      businessConfig.hidden = val
    }
    // rule: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
    // options: []
  }

  const businessConfig = {
    span: 11,
    hidden: false,
    prop: 'business',
    label: '选择业务：',
    component: 'Select',
    value: '',
    rule: [{ required: true,
      message: '请选择业务渠道',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const error = []
        // 全部干预
        if (typeConfig1.value && !value) {
          error.push(rule.message)
        }
        callback(error)
      } }],
    options: []
  }

  const updateDataConfig = {
    span: 11,
    prop: 'file',
    hidden: true,
    // label: '支付方式：',
    component: () => import('./file-info'),
    value: '',
    rule: [{ required: true,
      message: '请选择文件',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const error = []
        // 部分干预文件未上传
        if (typeConfig2.value && (!value || !value.name)) {
          error.push(rule.message)
        }
        callback(error)
      } }],
    options: []
  }

  return [
    [
      typeConfig1,
      { span: 1 },
      businessConfig
    ],
    [
      typeConfig2,
      { span: 1 },
      updateDataConfig
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
      interventionDesc: ''
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
            case 'business':
              v.options = srcBusinessList
              break
            default:
              break
          }
        }
      })
      this.editData = editData
      this.popup.show = true
      this.popup.extData = isEdit
      this.interventionDesc = ''
      if (!isClean) {
        this.popup.data = row
      }
    },
    saveExtData () {
      const interventionDesc = this.interventionDesc
      this.formEditValidate((valid, params) => {
        if (valid) {
          const reqPrm = {
            business: params.business,
            file: params.file,
            interventionDesc
          }
          // if (this.popup.extData) {
          //   reqPrm.id = this.popup.data.id
          // }
          baseApi
            .intervene(reqPrm, { type: params.type ? 'all' : 'part' })
            .then(({ data }) => {
              if (data.code === 200) {
                const callback = this.popup.srcData[1].callback
                callback && callback()
                this.$Message.success(`保存成功`)
                this.popup.show = false
                this.interventionDesc = ''
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
