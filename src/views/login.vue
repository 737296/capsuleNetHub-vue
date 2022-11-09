<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <div class="login"
       @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="true">
        <p slot="title">
          <Icon type="log-in"></Icon>欢迎登录胶囊网络中心Portal
        </p>
        <div class="form-con">
          <Spin fix
                size="large"
                v-if="spinShow"></Spin>
          <Form ref="loginForm"
                :model="form"
                :rules="rules">
            <FormItem prop="userCode">
              <Input v-model="form.userCode"
                     placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16"
                      type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password"
                     v-model="form.password"
                     placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14"
                      type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="capsulelogin"
                      type="primary"
                      long>登录</Button>
              <!-- <div style="height:10px"></div>
              <Button @click="ssoLogin" type="warning" long>SSO登录</Button>-->
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import { loginApi } from '../api/login.js'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        userCode: '',
        password: ''
      },
      rules: {
        userCode: [
          {
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      },
      spinShow: false // 登录加载中
    }
  },
  mounted () { },
  methods: {
    // 胶囊网络登录
    capsulelogin () {
      loginApi
        .capsulelogin({
          name: this.form.userCode,
          password: this.form.password
        })
        .then((res) => {
          console.log(res.data)
          if (res.data.code === 200) {
            this.$Message.success('登录成功!')
            this.$router.push({ name: 'home_index' })
          } else {
            this.$Message.error('账户密码错误')
          }
        })
    },
    // 废弃
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.spinShow = true
          loginApi
            .login({
              account: this.form.userCode,
              password: this.form.password
            })
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success('登录成功!')
                this.$router.push({ name: 'home_index' })
              } else {
                let errMassage = res.data.msg || '接口调用错误'
                throw new Error(errMassage)
              }
            })
            .catch((err) => {
              console.log(err)
              this.$Message.error('登录失败！')
            })
            .finally(() => {
              this.spinShow = false
            })
        }
      })
    },

    ...mapActions(['requestCommonData'])

  }
}
</script>
<style lang="less" src="./login.less" scoped>
</style>
