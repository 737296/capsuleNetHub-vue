<template>
  <Modal :mask-closable='false' v-model="modalShow" v-bind="$attrs">
    <Spin :fix="true" v-show="loading"></Spin>
    <template slot="header">
      <Row class="modal-header">
        <div class="icon"></div>
        <div class="title">
          <slot name="header"></slot>
        </div>
      </Row>
    </template>
    <slot name="body"></slot>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>

<script>
export default {
  name: 'Pupup',
  props: ['value', 'loading'],
  data () {
    return {}
  },
  computed: {
    modalShow: {
      get () {
        return this.value
      },
      set (val) {
        if (!val) {
          this.$emit('hide', val)
        }
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.modal-header {
  display: flex;
  align-items: center;
  margin-right: 40px;
  > .icon {
    float: left;
    width: 5px;
    height: 28px;
    background-color: rgb(245, 154, 35);
  }
  > .title {
    margin-left: 10px;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
