<template>
  <Pupup v-model="popup.show" :loading="popup.loading" class-name="popup-model" width="none">
    <template slot="header"> DSC餐厅扩展信息 </template>
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
        <!-- <template > -->
          <Button size="large" type="primary" @click="saveExtData">
            修改
          </Button>
        </template>
        <!-- <template v-else>
          <Button size="large" @click="_showPopup({})">清空</Button>
          <Button size="large" type="primary" @click="saveExtData">
            添加
          </Button>
        </template> -->
      </div>
    </div>
  </Pupup>
</template>

<script>
import baseApi from '../vpay-unionpay-management-api'
const getDefEditData = (row, objData) => {
  let arr = [[]]
  for (const key in objData) {
    let item = {
      span: 12,
      prop: key,
      label: key,
      component: 'Input',
      placeholder: '请输入',
      value: objData[key]
      // rule: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      // options: []
    }
    arr[0].push(item)
  }
  return arr

//   return [
//     [
//         {
//         span: 11,
//         prop: 'payBOC',
//         label: row.value1.label,
//         component: 'Input',
//         placeholder: '请输入',
//         value: row.value1.value
//         // rule: [{ required: true, message: '请输入内容', trigger: 'blur' }]
//         // options: []
//       },
//       {
//         span: 11,
//         prop: 'payBOC',
//         label: row.value1.label,
//         component: 'Input',
//         placeholder: '请输入',
//         value: row.value1.value
//         // rule: [{ required: true, message: '请输入内容', trigger: 'blur' }]
//         // options: []
//       },
//       {
//         span: 11,
//         prop: 'payBOC',
//         label: row.value1.label,
//         component: 'Input',
//         placeholder: '请输入',
//         value: row.value1.value
//         // rule: [{ required: true, message: '请输入内容', trigger: 'blur' }]
//         // options: []
//       },
//     ]
//   ]
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
      const [{ row } = {}] = params
      const { brand, storeCode } = row
      baseApi.getStoreExtInfo({ brand, storeCode }).then(({ data }) => {
        if (data.code === 200) {
          let dataD = data.data
          // let index = 1
          // for (const key in data.data) {
          //     dataD[`value${index}`] = {label: key, value: data.data[key]}
          //     index++
          // }
          params[0].row = {
            ...row,
            ...dataD
          }
          params[0].objData = data.data
          this._showPopup(...params)
        }
      })
    },
    _showPopup ({row, objData}) {
      // const {
      //   // srcBrandList,
      //   // srcPayTypeList,
      //   // srcSignTypeList,
      //   // 默认是编辑状态
      //   isEdit = true
      // } = this.popup.srcData[1]
      const isClean = !row
      !row && (row = this.popup.data || {})
      const editData = getDefEditData(row, objData)
      // this.$ArrayObjectEach(editData, (v) => {
      //   let value
      //   if (v && v.component) {
      //     (value = row[v.prop]) && (v.value = value)
      //     v.disabled = !row.isFranchisees
      //     // switch (v.prop) {
      //     //   case 'brand':
      //     //     v.options = srcBrandList
      //     //     break
      //     //   case 'channel':
      //     //     v.options = srcPayTypeList
      //     //     break
      //     //   case 'appId':
      //     //     v.disabled = isEdit
      //     //     break
      //     //   case 'signType':
      //     //     v.options = srcSignTypeList
      //     //     break
      //     //   default:
      //     //     break
      //     // }
      //   }
      // })
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
          const reqPrm = {
            ...params
          }
          reqPrm.info = params
          reqPrm.id = this.popup.data.id
          reqPrm.brand = this.popup.data.brand
          reqPrm.storeCode = this.popup.data.storeCode
          baseApi
            .updateStoreExtInfo(reqPrm)
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
