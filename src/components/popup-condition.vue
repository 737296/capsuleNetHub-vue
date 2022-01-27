<template>
  <Form
    ref="formEdit"
    :model="formInline"
    :rules="formInlineRole"
    :label-width="labelWidth || 110"
  >
    <!-- 第一行 -->
    <Row v-for="row in modelValue" :key="row.domKey">
      <Col
        v-for="(col, cidx) in row"
        :span="col.span"
        :key="cidx"
        class-name="col-height"
      >
        <template v-if="col.component">
          <FormItem
            :prop="col.prop"
            :label="col.label"
            :class="['cal-from-item', col.class]"
            v-show="!col.hidden"
          >
            <component
              :is="col.component"
              :disabled="col.disabled"
              :rows="col.rows"
              :type="col.type"
              :placement="col.placement"
              :format="col.format"
              :placeholder="col.placeholder"
              :multiple="col.multiple"
              :clearable="col.clearable"
              :value="col.value"
              @input="
                value => {
                  if (col.component !== 'DatePicker') {
                    col.value = value;
                  }
                }
              "
              @on-change="
                value => {
                  if (col.component === 'DatePicker') {
                    col.value = value;
                  } else if (col['on-change']) {
                    col['on-change'](value);
                  }
                }
              "
              :options="col.options"
              style="width: 100%"
            >
              <template v-if="col.component === 'Select'">
                <Option
                  v-for="item in col.options"
                  :value="item.code"
                  :key="item.code"
                  >{{ item.name }}</Option
                >
              </template>
              <template v-else-if="col.content">
                <span v-html="col.content"></span>
              </template>
            </component>
          </FormItem>
        </template>
        <!-- eslint-disable-next-line vue/no-parsing-error -->
      </Col>
    </Row>
  </Form>
</template>

<script>
export default {
  name: 'PopupCondition',
  props: ['value', 'labelWidth'],
  mounted () {
    this.$nextTick(() => {
      this.$emit('on-ref', {
        formEdit: this.$refs.formEdit,
        validate: this.validate.bind(this)
      })
    })
  },
  computed: {
    modelValue: {
      get () {
        return this.value.map(v => ({ ...v, domKey: Math.random() }))
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    formInline: {
      get () {
        const value = {}
        this.$ArrayObjectEach(this.value, v => {
          if (v && v.component && v.prop) {
            value[v.prop] = v.value
          }
        })
        return value
      },
      set (value) {
        this.$ArrayObjectEach(this.value, v => {
          if (v && v.component && v.prop) {
            v.value = value[v.prop]
          }
        })
      }
    },
    formInlineRole () {
      const value = {}
      this.$ArrayObjectEach(this.value, v => {
        if (v && v.component && v.prop) {
          value[v.prop] = v.rule
        }
      })
      return value
    }
  },
  methods: {
    validate (callback) {
      return new Promise((resolve, reject) => {
        this.$refs.formEdit.validate(valid => {
          try {
            callback && callback(valid, { ...this.formInline })
          } catch (error) {
            console.error(error)
          }
          resolve({ valid, params: { ...this.formInline } })
        })
      })
    }
  }
}
</script>

<style scoped>
.col-height {
  min-height: 1px;
}
</style>
