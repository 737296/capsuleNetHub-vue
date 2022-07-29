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
      <Poptip trigger="hover" title="证书示例" content="apiclient_cert.p12">
        <Button
          :disabled="!!uploading"
          size="small"
          type="primary"
          icon="ios-cloud-upload-outline"
        >
          选择证书
        </Button>
        </Poptip>
      </Upload>
      <span v-html="uploading || fileValue"></span>
    </Col>
  </Row>
</template>
<script>
// import { toBase64 } from '@/utils/common'
import baseApi from '../weapp-merchant-management-api'
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
        return this.fileName
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
    //   if (!/^.*\.pem$/.test(file.name)) {
    //     this.$Message.error(`请选择证书文件（pem）`)
    //     return false
    //   }
      if (!/^.*\.(pem|p12|cer|pfx)$/.test(file.name)) {
        this.$Message.error(`请选择以 pem|p12|cer|pfx 结尾的文件）`)
        return false
      }
      if (file.size / 1024 > 200) {
        this.$Message.error(`证书文过大`)
        return false
      }
      // toBase64(file).then((data) => {
      //   this.fileData = data
      //   this.fileValue = file.name
      // }, (e) => {
      //   this.$Message.error(e.message)
      //   this.fileValue = '选择的文件不支持'
      // })
      this.uploading = '上传中...'
      baseApi
        .uploadFile(file)
        .then(({ data }) => {
          if (data.code === 200) {
            this.uploading = ''
            this.fileData = data.data.path
            this.fileValue = file.name
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`${err.message}`)
          this.uploading = ''
          this.fileName = '上传失败'
        })

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
