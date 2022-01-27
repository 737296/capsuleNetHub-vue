<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Row class="merchant-body" type="flex" justify="center" align="middle">
    <Col span="2"></Col>
    <Col span="6" class="font-primary"> ***网支场景请完成圈约*** </Col>
    <Col span="16">
      <Row>
        <Col span="24">
          移动支付签约地址：<span>http://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          PC 支付签约地址：<span class="font-http">http://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
        </Col>
      </Row>
    </Col>
  </Row>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.merchant-body {
  height: 60px;
  background-color: #dddee1;
  .font-primary {
    color: #2d8cf0;
  }
  // .font-http{
  //   margin-left: 5px;
  // }
}
</style>
