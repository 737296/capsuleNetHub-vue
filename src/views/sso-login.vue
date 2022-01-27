<template>
  <div class="sso-login">
    <Spin fix></Spin>
  </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.sso-login {
  // position: relative;
  flex: 1;
  /deep/ .ivu-spin-dot{
    width: 100px;
    height: 100px;
  }
}
</style>
