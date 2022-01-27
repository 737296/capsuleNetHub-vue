<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Row class="certificate-body" type="flex" justify="center" align="middle">
    <Col span="1" />
    <Col span="23">
      <Upload
        action=""
        :before-upload="uploadFile"
        style="display: inline-block"
      >
        <Button
          :disabled="!!uploading"
          size="small"
          type="primary"
          icon="ios-cloud-upload-outline"
        >
          选择文件
        </Button>
      </Upload>
      <span v-html="uploading || fileValue"></span>
    </Col>
  </Row>
</template>
<script>
export default {
  props: ['value', 'fileName'],
  data () {
    return {
      uploading: ''
    }
  },
  computed: {
    fileValue: {
      get () {
        return this.fileName || '*支持xlsx扩展名模板录入相关信息'
      },
      set (val) {
        this.$emit('update:fileName', val)
      }
    },
    fileData: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    uploadFile (file) {
      if (!/^.*\.xlsx$/.test(file.name)) {
        this.$Message.error(`请选择模板文件（xlsx）`)
        return false
      }
      this.fileData = file
      this.fileValue = file.name

      return false
    }
  }
}
</script>
<style lang="less" scoped>
// .certificate-body {
//   height: 60px;
//   background-color: #dddee1;
//   .font-primary {
//     color: #2d8cf0;
//   }
//   // .font-http{
//   //   margin-left: 5px;
//   // }
// }
</style>
