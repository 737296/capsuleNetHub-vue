<template>
  <div>
    <Tag
      v-for="tag in options"
      checkable
      :checked="selectTag[tag.code] || false"
      v-bind="tag"
      @on-change="clickTag(tag)"
      :key="tag.dom_key"
    >
      {{ tag.name }}
    </Tag>
  </div>
</template>

<script>
export default {
  name: 'TagSelect',
  props: ['value', 'options'],
  computed: {
    modelValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    selectTag () {
      return this.modelValue.reduce((sum, val) => {
        sum[val] = true
        return sum
      }, {})
    }
  },
  methods: {
    clickTag (tag) {
      // 已选中,取消选中
      if (this.selectTag[tag.code]) {
        this.modelValue = this.modelValue.filter((v) => v !== tag.code)
      } else {
        this.modelValue.push(tag.code)
      }
    }
  }
}
</script>
