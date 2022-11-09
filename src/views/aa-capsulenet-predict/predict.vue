<template>
  <div>
    <div style="padding: 0% 20%">
      <Card :bordered="false"
            style="width:100%">
        <Steps :current="current">
          <Step title="选择图片"></Step>
          <Step title="等待检测"></Step>
          <Step title="正在检测"></Step>
          <Step title="完成检测"></Step>
        </Steps>
      </Card>
    </div>
    <br>
    <div style="padding: 0% 20%">
      <Card style="width:100%">
        <template #title>

        </template>
        <Form label-position="left">
          <FormItem label="上传图片：">
            <div id="group">
              <div v-if="
                    file
                    ==null">
                <Upload action="//jsonplaceholder.typicode.com/posts/"
                        :form="['jpg', 'jpeg', 'png', 'gif']"
                        :before-upload="handleUpload">
                  <Button>选择图片（图片格式：png）</Button>

                </Upload>
              </div>
              <div v-if="
                    file
                    !==null">

                <Button type="primary"
                        @click="upload()"
                        :loading="loadingStatus">{{
                          loadingStatus ? "预测中" : "开始预测"
                      }}</Button>
              </div>
            </div>
          </FormItem>
          <FormItem label="图片名称：">
            {{fileName}}
          </FormItem>
          <FormItem label="检测结果：">
            <h2>{{predict}}</h2>
          </FormItem>
          <FormItem label="检测耗时：">
            {{predictTime}}
          </FormItem>
          <FormItem label="图片显示：">
            <img :src="fileUrl"
                 width="300px"
                 height="300px" />
          </FormItem>

        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
// import baseApi from './application-api'
// import page-tablecopy from '@/components/page-tablecopy.vue'

// eslint-disable-next-line no-unused-vars

export default {
  data () {
    return {
      // 图片上传地址变量
      // url: process.env.API_BASE_URL + '/api/upload',
      url: 'http://localhost:8080/api/upload',
      // 生产地址
      // url: 'http://120.46.187.24:8080/api/upload',
      // 图片文件
      file: null,
      // 图片名
      fileName: null,
      // 上传按钮显示按钮
      loadingStatus: false,
      // 预测结果
      predict: null,
      // 图片显示url
      fileUrl: null,
      // 预测开始时间
      predictStratTime: null,
      // 预测结束时间
      predictEndTime: null,
      // 检测耗时
      predictTime: null,
      // 检测流程
      current: 0
    }
  },

  created () {
  },

  methods: {
    // 钩子函数提交图片之后
    handleUpload (file) {
      this.current = 1
      this.predictTime = null
      this.predict = null
      // 给图片赋值
      this.file = file
      this.fileUrl = window.URL.createObjectURL(file)
      this.fileName = file.name
      // this.filedemo = require('@/assets/img/' + this.b + '.png')
      console.log('钩子函数')
      return false
    },
    // 上传图片
    upload () {
      this.current = 3
      this.predictStratTime = new Date()
      console.log('预测开始时间：' + this.predictStratTime)
      this.loadingStatus = true
      let fileFormData = new FormData()
      fileFormData.append('photos', this.file)
      console.log(fileFormData)
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.$http.post(this.url, fileFormData, requestConfig).then((res) => {
        this.file = null
        this.loadingStatus = false
        console.log(res)
        if (res.data['code'] === 200 || res.data['code'] === '200') {
          console.log(res.data.data)
          this.predict = res.data.data
          this.$Notice.success({
            title: res.data.data,
            duration: 3

          })
          this.predictEndTime = new Date()
          console.log('预测结束时间：' + this.predictEndTime)
          this.predictTime = (this.predictEndTime - this.predictStratTime) + 'ms'
          this.current = 4
        } else {
          this.$Notice.error({
            title: res.data.msg ? res.data.msg : '上传失败，请联系管理员',
            duration: 3
          })
          this.current = 0
          console.log('test' + res.data.msg)
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
#group {
  display: flex;
  justify-content: flex-start;
}

// .h2 {
//   color: red !important;
// }
</style>
