import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import tab from '@/components/tab'
import first from '@/components/first'
import manage from '@/components/manage'
import recharge from '@/components/recharge'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: tab,
      children:[
        {path:'/',name:'first',component:first},
        {path:'manage',name:'manage',component: manage},
        {path: 'recharge',name:'recharge',component: recharge}
      ]
    }
  ]
})
