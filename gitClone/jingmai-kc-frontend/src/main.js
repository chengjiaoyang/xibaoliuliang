import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import VTooltip from 'v-tooltip'
import './theme/index.less'
import './css/common.css'
import Vuelidate from 'vuelidate'

import App from './App.vue'
import Login from './components/Login.vue'
import Account from './components/Account.vue'
import Campaign from './components/Campaign.vue'
import Adgroup from './components/Adgroup.vue'
import Diagnosis from './components/Diagnosis.vue'
// import Campaign from './components/Campaign.vue'
/* import Register from './components/Register.vue'
import SettingItems from './components/SettingItems.vue'
import SettingItemReport from './components/SettingItemReport.vue'
import SettingShopReport from './components/SettingShopReport.vue'
import SettingProductReport from './components/SettingProductReport.vue'
import SettingKeywordsReport from './components/SettingKeywordsReport.vue'
import ShopItems from './components/ShopItems.vue'
import SetupShopItems from './components/SetupShopItems.vue'
*/

import store from './store'
import * as types from './store/mutation-types'

Vue.use(iView)
Vue.use(VueRouter)
Vue.use(VTooltip)
Vue.use(Vuelidate)


const router = new VueRouter({
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  }, {
    name: 'account',
    path: '/',
    component: Account,
    meta: {
      auth: true
    }
  }, {
    name: 'campaign',
    path: '/campaign/:id',
    component: Campaign,
    meta: {
      auth: true
    }
  }, {
    name: 'adgroup',
    path: '/adgroup/:campaignId/:id',
    component: Adgroup,
    meta: {
      auth: true
    }
  }, {
    name: 'diagnosis',
    path: '/diagnosis',
    component: Diagnosis,
    meta: {
      auth: true
    }
  }/*, {
    name: 'setting-item-report',
    path: '/setting-item-report/:shop_id/:item_id',
    component: SettingItemReport,
    meta: {
      auth: true
    }
  }, {
    name: 'setting-shop-report',
    path: '/setting-shop-report/:shop_id',
    component: SettingShopReport,
    meta: {
      auth: true
    }
  }, {
    name: 'setting-product-report',
    path: '/setting-product-report/:shop_id',
    component: SettingProductReport,
    meta: {
      auth: true
    }
  }, {
    name: 'setting-keywords-report',
    path: '/setting-keywords-report/:shop_id',
    component: SettingKeywordsReport,
    meta: {
      auth: true
    }
  }, {
    name: 'shop-items',
    path: '/shop-items',
    component: ShopItems,
    meta: {
      auth: true
    }
  }, {
    name: 'setup-shop-items',
    path: '/setup-shop-items',
    component: SetupShopItems,
    meta: {
      auth: true
    }
  }*/]
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const runner = async() => {
    if (to.path !== '/login' && to.matched.some(record => record.meta.auth)) {
      try {
        await store.dispatch(types.GET_USER_INFO_REQUEST)
        next()
      } catch (e) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    } else if (to.matched.some(record => record.meta.auth)) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  }
  runner()
})

router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
});

/* eslint-disable no-new*/
new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
})
/* eslint-enable no-new*/
