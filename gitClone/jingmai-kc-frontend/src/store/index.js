import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import campaign from './modules/campaign'
import adgroup from './modules/adgroup'
import keyword from './modules/keyword'
import strategy from './modules/strategy'
import ad from './modules/ad'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    campaign,
    adgroup,
    keyword,
    ad,
    strategy
  },
  strict: debug
})
