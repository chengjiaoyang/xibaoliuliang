<template>
    <div>
        <h4 class="top">直通车官方应用</h4>
        <header>
            <div class="number">
                <p>昨日花费</p>
                <span>{{msg}}</span>
            </div>
           <!--  <div class="number">
                <p>账户余额</p>
                <span>{{msg}}</span>
            </div> -->
            <router-link to="">
                <div class="car">直通车充值</div>
            </router-link>
        
        </header>
        <nav>
            <div class="timenumber">
                <p>实时数据</p>
            </div>   
            <ul>
                <li v-for="item in objects">
                    <p>{{item.title}}</p>
                    <span>{{item.data}}</span>
                </li>
                <div style="width:100%;clear:left"></div>
            </ul>
        </nav>      
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
    name:'first',
    data (){
        return{
            msg:'0',
            objects:[
                {title:'花费', data:'0'},
                {title:'点击量', data:'0'},
                {title:'展现量', data:'0'},
                {title:'点击率', data:'0'},
                {title:'平均点击花费', data:'0'},
                {title:'总成交比数', data:'0'},
                {title:'总成交金额', data:'0'},
                {title:'投入产出比', data:'0'},
                {title:'点击转化率', data:'0'},
                {title:'总购物车数', data:'0'},
                {title:'总收藏数', data:'0'}
            ],
            selected:'tab1'
        }
    },
    created(){
        console.log(0);
        axios.get('http://dev.wen.xibao100.com:8010/api/campaign/list')
            .then(function (response) {
                console.log(response);
        })
            .catch(function (error) {
                console.log(error);
        });
    }
    
}
</script>

<style scoped>
    .top{
        width:100%;
        height:70px;
        line-height: 70px;
    }
    header{
        width:100%;
        height: 150px;
        background-color: orange;
        color:#fff;
    }
    .number{
        float:left;
        width:2rem;
        padding-top:20px;
    }
    .number p{
        font-size:0.4rem;
    }
    .number>span{
        display:inline-block;
        padding-top:2px;
        font-size:0.6rem;
    }
    .car{
        float:right;
        margin:50px 20px 0 0;
        display:inline-block;
        width:170px;
        height:50px;
        line-height: 50px;
        border-radius:8px;
        border:1px solid #dedede;
        color:#fff;
    }
    .timenumber{
        margin:30px 0;
    }
    .timenumber p{
        font-size:0.4rem;
    }
    nav ul{
        width:100%;
        border-top:1px solid #dedede;
        border-left:1px solid #dedede;
    }
    nav ul li{
        float:left;
        width:33%;
        height:220px;
        border-bottom:1px solid #dedede;
        border-right:1px solid #dedede;
    }
    nav ul li:nth-child(3n){
        width:34%
    }
    nav ul li p{
        padding-top:58px;
        font-size:0.4rem;
    }
    nav ul li span{
        display: inline-block;
        padding-top:10px;
        color:orange;
        font-size:0.8rem;
    }
</style>


