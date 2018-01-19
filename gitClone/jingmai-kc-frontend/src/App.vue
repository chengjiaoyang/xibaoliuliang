<template>
  <div id="app">
    <nav-header></nav-header>
    <div style="clear:both">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import NavHeader from './components/NavHeader.vue'
  export default {
    components: {
      'nav-header': NavHeader
    }
  }
</script>