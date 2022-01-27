<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Row class="certificate-tips" type="flex" justify="space-around" align="middle">
    <template v-for="tip in showTips">
      <Col :span="tip.span" :key="'c' + tip.index">
        <span :key="'t' + tip.index" class="font-primary" v-html="tip.title"></span>
        <span :key="'v' + tip.index" v-html="tip.value"></span>
      </Col>
    </template>
    </Col>
  </Row>
</template>
<script>
export default {
  data () {
    return {
      preSpan: 2,
      tips: [
        {
          title: '* 证书上传',
          value: '云闪付、数字必须'
        },
        {
          title: '* 公钥配置',
          value: '美团、饿了么、支付宝必须'
        },
        {
          title: '* 私钥配置',
          value: '美团、饿了么不需要配置，其余需要配置'
        }
      ]
    }
  },
  computed: {
    showTips () {
      const tips = this.tips || []
      // const span = (24 - this.preSpan) / tips.length
      return tips
    }
  }
}
</script>
<style lang="less" scoped>
.certificate-tips {
  height: 60px;
  background-color: #dddee1;
  margin-bottom: 15px;
  .font-primary {
    font-weight: 700;
  }
  // .font-http{
  //   margin-left: 5px;
  // }
}
</style>
