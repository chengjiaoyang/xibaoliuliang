<template>
  <Row type="flex" justify="center">
    <Col span="8">
      <Card style="margin-top:20px">
        <p slot="title">登录系统</p>
        <p>
          <Form ref="loginForm" :model="loginForm" :rules="loginRule">
          <FormItem prop="uname">
            <Input type="text" v-model="loginForm.uname" placeholder="用户名">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="passwd">
            <Input type="password" v-model="loginForm.passwd" placeholder="密码">
              <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="loading" @click="handleLoginSubmit('loginForm')" long>
              <span v-if="!loading">点击登录</span>
              <span v-else>登录...</span>
            </Button>
          </FormItem>
        </Form>
        </p>
      </Card>
    </Col>
  </Row>
</template>

<script>
  import * as types from '../store/mutation-types'

  export default {
    data() {
      return {
        loading: false,
        loginForm: {
          uname: '',
          passwd: ''
        },
        loginRule: {
          uname: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          passwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { type: 'string', min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleLoginSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store.dispatch(types.LOGIN_REQUEST, this.loginForm).then(res => {
              this.loading = false
              this.$router.push({name: 'account'})
            }, err => {
              this.loading = false
              this.$Modal.error({title: '错误', content: err.msg ? err.msg : 'unknown error'})
            });
          }
        })
      }
    },
    computed: {
    }
  }
</script>