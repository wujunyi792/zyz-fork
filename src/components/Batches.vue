<template>
  <div>
    <van-nav-bar
      title="课程类型"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <!-- <div class="block">
      <span class="blocktext-center">
        请选择您要选课的批次
      </span>
    </div> -->
    <!-- 课程列表 -->
    <div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        error-text="加载失败"
        @load="onLoad"
      >
        <div v-for="item in batches.list" :key="item" class="block">
          <van-card class="vancard">
            <template #title>
              <span class="courseText">{{item.name}}</span><br>
              <span class="courseText">选课时间：{{item.starttime}}至{{item.endtime}}</span><br>
              <!-- <span class="courseText">批次名称：{{item.name}}</span><br> -->
              <!-- <span class="courseText" v-show="item.describe!=''">批次描述：{{item.describe}}</span><br> -->
            </template>
            <template #footer>
              <div class="keButton">
                <div class="commonButton" @click="tocourse(item.no,item.starttime,item.endtime)">查看</div>
              </div>
              <!-- <img src="../../static/enterButton.png" class="keButton" @click="tocourse(item.no)"> -->
            </template>
          </van-card>
        </div>
      </van-list>
    </div>
    
  </div>
</template>

<script>
  import { ref,reactive,onMounted,onBeforeMount } from 'vue';
  import { useRouter } from "vue-router";
  import { useRoute } from "vue-router";
  import { Toast } from 'vant';
  const axios = require('axios');

  export default {
    name: 'batches',
    setup() {
      const loading = ref(false);
      const finished = ref(false);
      const router = useRouter();
      const route = useRoute();
      const number= route.query.number;
      const email= route.query.email;
      const pwd = route.query.pwd;//接收密码
      const username = route.query.username;//接收用户名
      const batches = reactive({list:[]});

      onBeforeMount(()=>{
        //确认密码及用户名正确
        axios({
          method:'get',
          url:'user/login',
          params:{
            username:username,
            password:pwd,
            userlevel:"1",
          }
        })
        .then(function (response) {
          if (response.data.statuscode==3) {
            //密码正确
          }else{
            router.push('/force');//密码错误
          }
        })
        .catch(function (error) {
            console.log("catch"+error);
            Toast('登陆失败，请检查网络');
        });
      })


      //获取批次列表
      function onLoad(){
          axios({
            method:'get',
            url:'student/showbatch',
            params:{
              number:number,
            }
          })
          .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
              batches.list.push(response.data[i]);
              //去除“-”及后面的内容
              let batchName = batches.list[i].name;
              for (let j = 0; j < batchName.length; j++) {
                const ch = batchName[j];
                if (ch=='-') {
                  batches.list[i].name=batches.list[i].name.slice(0,j);
                }
              }
            }
        
            loading.value = false;
            finished.value = true;
          })
          .catch(function (error) {
              console.log("catch"+error);
              Toast('获取批次信息失败，请检查网络');
          });
      }

      function tocourse(batchid,start,end) {
        router.push({path:'/courses',query:{number:number,batchId:batchid,email:email,pwd:pwd,username:username,start:start,end:end}});
      }

      const back = () => history.back();

      return {
        loading,
        finished,
        back,
        batches,
        number,
        tocourse,
        onLoad,
        onMounted,
      };
    },
  }
</script>

<style scoped>
  .block{
    height: 100%;
    margin: 2%;
    background-color: white;
    border-radius: 10px;
  }
  .vancard{
    margin:10px;
    background-color: white;
  }
  .courseText{
    font-size: 14px;
  }
  .keButton{
    height: auto;
    width: auto;
    margin-left: 85%;
    transform: translate(-85%);
  }
  .blocktext{
    margin-left: 15px;
    font-size: 14px;
    text-align: center;
  }
  .blocktext-center{
    position: relative;
    margin-left: 30%;
    font-size: 14px;
    /* text-align: center; */
  }
</style>
