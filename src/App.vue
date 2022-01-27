<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  data () {
    return {
      theme: this.$store.state.app.themeColor
    }
  },
  beforeDestroy () {},
  methods: {
  }
}
</script>

<style lang="less" src='./styles/common.less'>
</style>
<style>
.app-main {
  width: 100%;
  height: 100%;
}
::-webkit-scrollbar {
  width: 8px;
  height: 9px;
}

::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.2);
  height: 1rem;
  border-radius: 1rem;
}

::-webkit-scrollbar-thumb:vertical {
  height: 1rem;
  border-radius: 1rem;
  background-color: #78baff
}

::-webkit-scrollbar-thumb:horizontal {
  height: 1rem;
  border-radius: 1rem;
  background-color: #78baff
}
.special .ivu-form-item-content {
  margin-left: 0px !important;
}
.ivu-select-multiple .ivu-tag {
  height: 24px;
  line-height: 22px;
  margin: 3px 3px 3px 0 !important;
}
</style>
