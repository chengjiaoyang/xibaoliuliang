<template>
  <Menu mode="horizontal" theme="dark" active-name="account" @on-select="handleSelect">
      <div class="nav-logo">
        <img src="https://xbcdn-ssl.xibao100.com/jingmai-kc/logo.png" />
      </div>
      <div class="nav-menu">
        <MenuItem name="account">
          <Icon type="wand"></Icon>
          智能托管
        </MenuItem>
        <MenuItem name="diagnosis">
          <Icon type="ios-bolt"></Icon>
            账户诊断
        </MenuItem>
      </div>
      <div class="nav-user">
        <MenuItem name="account" v-if="logined">
          <Avatar icon="person" />
          {{ user.nick }}
        </MenuItem>
        <MenuItem name="login" v-else>
            <Icon type="ion-log-in"></Icon>
            登录
        </MenuItem>
      </div>
  </Menu>
</template>
<script>
  export default {
    data() {
      return {}
    },
    computed: {
      logined() {
        return this.$store.getters['loggedIn']
      },
      user() {
        return this.$store.getters['userInfo']
      }
    },
    methods: {
      handleSelect(name) {
        console.log(name)
        this.$router.push({name: name})
      }
    }
  }
</script>