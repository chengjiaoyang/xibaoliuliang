<template>
  <div>
      <h4 class="top">充值</h4>
      <nav>
         <div class="number">
            <span>{{msg}}</span>
            <p>账户余额（元）</p>
         </div>
         <input class="money" type="text" placeholder="请输入充值金额">
      </nav>
      <div>
        <ul>
          <li v-for="item in objects">
              <p>{{item.data}}</p>
          </li>
          <div style="width:100%;clear:left"></div>
        </ul>
      </div>
        <input class="button" type="button" value="确认充值">
  </div>
</template>

<script>
export default {
  name:'recharge',
  data:function (){
      return{
         msg:'0.00',
          objects:[
              {data:'200'},
              {data:'500'},
              {data:'1000'},
              {data:'2000'},
              {data:'5000'},
              {data:'100000'}
            ],
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
    .number{
      width:100%;
      height: 150px;
      border-top:1px solid #dedede;
      border-bottom:1px solid #dedede;
    }
    .number>span{
      display:inline-block;
      color:orange;
      font-size:0.7rem;
      padding-top:10px;
    }
    .money{
      width:100%;
      height:90px;
      padding-left:16px;
      font-size:0.5rem;
    }
    div ul{
        width:100%;
        border-top:1px solid #dedede;
        border-left:1px solid #dedede;
    }
    div ul li{
        float:left;
        width:33%;
        height:120px;
        border-bottom:1px solid #dedede;
        border-right:1px solid #dedede;
    }
    div ul li:nth-child(1),div ul li:nth-child(4){
      border-left:0;
    }
    div ul li:nth-child(3n){
        width:34%
    }
    div ul li p{
      font-weight: 300;
      font-size:0.6rem;
      line-height: 120px;
      padding:0;
    }
    .button{
      margin-top:50px;
      width:96%;
      height:70px;
      background-color: orange;
      color:#fff;
      border:none;
      border-radius: 5px;
      font-size:0.4rem;
    }
</style>


