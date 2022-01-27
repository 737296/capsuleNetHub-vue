<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Row type="flex">
    <Col v-for="v in showData" class="value-item" :key="v.key">
      <span class="title">{{ v.title }}</span>
      <span class="value">{{ v.value }}</span>
    </Col>
  </Row>
</template>

<script>
export default {
  props: ['value', 'autoShow'],
  computed: {
    showData () {
      const valueList = this.value || []
      const autoShow = this.autoShow === undefined ? true : this.autoShow
      return autoShow ? valueList.filter(({value: v}) => v || v === 0) : valueList
    }
  }
}
</script>

<style lang="less" scoped>
.value-item {
  font-size: 13px;
  padding: 18px 0px;
  min-width: 150px;
  margin-left: 40px;
  .title {
    font-weight: 600;
    color: #1c2438;
  }
  .value {
    color: #495060;
  }
}
</style>
