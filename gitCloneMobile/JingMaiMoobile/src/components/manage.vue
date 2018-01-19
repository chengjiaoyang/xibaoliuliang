<template>
  <div id="app">
      <h4 class="top">计划</h4>
    <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide>
            <ul class="menu_box">
                <li>花费</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>点击量</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>平均点击花费</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>花费</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>花费</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>花费</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>花费</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>花费</li>
            </ul>
        </swiper-slide>
        <swiper-slide>
            <ul class="menu_box">
                <li>花费</li>
            </ul>
        </swiper-slide>
    </swiper>
   
    <div style="width:100%;clear:left"></div>
    <div>{{msg}}</div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name:'recharge',
  components: {
    swiper,
    swiperSlide
  },
  data:function (){
      return{
         msg:'hello 充值.......',
         swiperOption: {
            slidesPerView: 3,
        }
      }
     
  }
}
</script>

<style scoped>
    .top{
        width:100%;
        height:70px;
        line-height: 70px;
    }
    .swiper-container ul.menu_box{
        display: block;
        width:1000%;
    }
    .swiper-container ul.menu_box li{
        padding:10px 110px ;
        background:url('../assets/css/line.png') no-repeat bottom right;
        line-height:70px;
        background-size:2px;
        float:left;
        display: block;
        border-bottom:2px solid orange;
        text-align: center;
    }
</style>


