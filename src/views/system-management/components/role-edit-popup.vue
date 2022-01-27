<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Pupup v-model="popup.show" :loading="popup.loading"  class-name="popup-model" width="none">
    <template slot="header"> 角色管理 </template>
    <template slot="body">
      <div class="scroll-warp">
        <popup-condition
          v-model="editData"
          @on-ref="({ validate }) => (this.formEditValidate = validate)"
        ></popup-condition>
        <Form
          :model="{}"
          :label-width="110"
        >
          <Row>
            <Col :span="21" class-name="col-height">
              <FormItem prop="list" label="菜单权限：" class="cal-from-item">
                <div class="tree-menu">
                  <Tree
                  ref="MenuTree"
                  :data="srcCopyMenuTree"
                  :expand='false'
                  show-checkbox
                  ></Tree>
                </div>
              </FormItem>
            </Col>
          </Row>
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
import baseApi from '../role-management-api'
const getDefEditData = () => {
  return [
    [
      {
        span: 11,
        prop: 'roleName',
        label: '角色名：',
        component: 'Input',
        placeholder: '请输入角色名',
        value: '',
        rule: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        options: []
      },
      { span: 1 },
      {
        span: 11,
        prop: 'roleCode',
        label: '角色编码：',
        component: 'Input',
        placeholder: '请输入角色编码',
        value: '',
        rule: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
        options: []
      }
    ],
    [
      {
        span: 11,
        prop: 'enableFlag',
        label: '状态：',
        component: 'Select',
        value: '',
        rule: [{ required: true, message: '请选择状态', trigger: 'blur' }],
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
        value: '',
        rule: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    ]
    // [
    //   {
    //     span: 11,
    //     prop: 'list',
    //     label: '分配角色：',
    //     component: 'Select',
    //     multiple: true,
    //     value: [],
    //     rule: [{ required: true,
    //       message: '请选择分配角色',
    //       trigger: 'blur',
    //       validator: (rule, value, callback) => {
    //         const error = []
    //         if (!value || value.length <= 0) {
    //           error.push(rule.message)
    //         }
    //         callback(error)
    //       }
    //     }],
    //     options: []
    //   }
    // ]
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
      srcCopyMenuTree: []
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
        srcMenuTree,
        srcStateList,
        // 默认是编辑状态
        isEdit = true
      } = this.popup.srcData[1]
      const isClean = !row

      const promise =
        isEdit && !isClean
          ? baseApi
            .getDetails({
              id: row.id
            })
            .then(({ data }) => {
              if (data.code === 200) {
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
        this.$ArrayObjectEach(editData, v => {
          let value
          if (v && v.component) {
            (value = row[v.prop]) && (v.value = value)
            switch (v.prop) {
              case 'enableFlag':
                v.value = value !== false ? 'true' : 'false'
                v.options = srcStateList
                break
              case 'list':
                v.options = srcMenuTree
                break
              default:
                break
            }
          }
        })
        const srcCopyMenuTree = () => {
          const selectedRow = row
          let idMap = {}
          if (selectedRow && (selectedRow.list || []).length > 0) {
            idMap = selectedRow.list.reduce((sum, val) => {
              sum[val] = true
              return sum
            }, {})
          }
          this.$ArrayObjectEach(srcMenuTree, (node, parent, key, depth) => {
            if (node.children) {
              node.children.forEach((c) => {
                c.pid = node.id
              })
            }
            node.expand = false
            // if (idMap[node.id]) {
            //   node.checked = true
            //   if (parent && key) {
            //     // parent.expand = true
            //   }
            // }
            if (node.pid === '0') {
              node.expand = true
            } else {
              if (idMap[node.id]) {
                node.checked = true
              }
            }
          })
          return srcMenuTree
        }
        this.srcCopyMenuTree = srcCopyMenuTree()
        this.editData = editData
        this.popup.show = true
        this.popup.extData = isEdit
        if (!isClean) {
          this.popup.data = row
        }
      })
    },
    saveExtData () {
      this.formEditValidate((valid, params) => {
        if (valid) {
          const nodes = this.$refs.MenuTree.getCheckedNodes()
          const nodeids = Object.keys((nodes || []).filter(node => !node.children).reduce((sum, val) => {
            val.id && (sum[val.id] = true)
            val.pid && (sum[val.pid] = true)
            return sum
          }, {}))
          const reqPrm = {
            ...params,
            enableFlag: params.enableFlag === 'true',
            list: nodeids
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
            .catch(err => {
              this.$Message.error(`操作失败！${err.message}`)
              console.log(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tree-menu{
  // border: 1px solid;
  max-height: 500px;
  overflow-y: auto;
}
</style>
