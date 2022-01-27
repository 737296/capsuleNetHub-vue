<template>
  <div class="table-box">
    <Spin :fix="true" v-show="modelValue.loading"></Spin>
    <div class="oper-wrapper" v-if="$slots.oper">
      <slot name="oper"></slot>
    </div>
    <Table
      ref="table"
      v-if="modelValue.table && !modelValue.table.hide"
      v-bind="modelValue.table"
      v-on="modelValue.table.on"
    ></Table>
    <div class="page-wrapper">
      <Page
        v-if="modelValue.page && !modelValue.page.hide"
        v-bind="modelValue.page"
        v-on="modelValue.page.on"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: ['value'],
  data () {
    return {}
  },
  watch: {
    '$refs.table' (val) {
      this.$emit('on-table-ref', val)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$emit('on-table-ref', this.$refs.table)
    })
  },
  beforeDestroy () {
    this.$emit('on-table-ref', null)
  },
  computed: {
    modelValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style>
</style>
