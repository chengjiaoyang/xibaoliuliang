// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import MintUI from 'mint-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import './assets/css/common.css'
import './assets/css/swiper.min.css'
import './assets/css/iconfont.css'
import 'mint-ui/lib/style.css'
import 'lib-flexible/flexible.js'
import App from './app'


Vue.config.productionTip = false;
Vue.use(MintUI);
Vue.use(VueAwesomeSwiper);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
