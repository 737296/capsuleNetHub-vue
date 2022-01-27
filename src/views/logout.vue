<template>
  <div class="logout">
    <div class="content-wrapper">
      <div class="title">
        <div class="logo"></div>
        <h2 class="text">PAYHUB 支付中心Portal</h2>
      </div>
      <div class="content">
        <h3 v-html="contentText"></h3>
      </div>
    </div>
  </div>
</template>
<script>
// import logo from '@/images/logo-min.png'
export default {
  computed: {
    contentText () {
      return this.$route.name === 'logout' ? '请关闭浏览器以完全退出登录状态!' : '暂无访问权限,请联系管理员!'
    }
  }
}
</script>
<style lang="less" scoped>
.logout {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content-wrapper{
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 300px;
    background-color: rgb(66, 170, 206);
    border-radius: 15px;
    padding: 15px;
    padding-top: 10px;
    .title{
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .logo{
        width: 50px;
        height: 50px;
        background: url("../images/logo-min.png");
        background-size: 100%;
        margin-right: 10px;
      }
      .text{
        color: #fff;
      }
    }
    .content{
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgb(239, 235, 239);
      border-radius: 3px;
    }
  }
}
</style>
