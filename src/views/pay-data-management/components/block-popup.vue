<template>
  <Pupup v-model="popup.show" :loading="popup.loading" class-name="popup-model" width="none">
    <template slot="header"> 阻断缓存刷新 </template>
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
const getDefEditData = () => [
  [
    {
      span: 10,
      prop: 'business',
      label: '业务编码：',
      component: 'Select',
      value: '',
      rule: [{ required: true, message: '请选择业务编码', trigger: 'blur' }],
      options: []
    },
    {
      span: 1
    },
    {
      span: 10,
      prop: 'environment',
      label: '环境：',
      component: 'Select',
      value: '',
      rule: [{ required: true, message: '请选择环境', trigger: 'blur' }],
      options: []
    }
  ]
]

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
        srcEnvironmentList,
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
            case 'environment':
              v.options = srcEnvironmentList
              break
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
      if (!isClean) {
        this.popup.data = row
      }
    },
    saveExtData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          baseApi
            .block(params)
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
