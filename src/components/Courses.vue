<template>
  <div>
    <van-nav-bar
      title="课程列表"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="block-center">
        您目前还有{{mustChoseNum}}节必选课程未选
    </div>
    <!-- <van-button @click="refresh">刷新</van-button> -->
    <!-- 课程列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      error-text="加载失败"
      @load="onLoad"
    >
      <div v-for="item in courses.list" :key="item" class="block">
        <div class="card">
          <div class="title-text">{{item.name}}</div>
          <!-- <div class="courseText">授课老师：{{item.teachername}}</div> -->
          <!-- <div class="courseText">上课时间：{{item.time}}</div> -->
          <van-tag class="must-tag" plain type="danger" v-show="item.mustchose">必修</van-tag>
          <van-tag class="selected-tag" plain type="primary" v-show="item.selected">已选</van-tag>
          <div class="common-text" v-show="item.description!=''">课程简介：{{item.description}}</div>
          <div class="toRight">
            <div class="right-button">
              <div @click="toclass(item.no)" class="commonButton">查看</div>
            </div>
            <!-- <img src="../../static/enterButton.png" class="right-button" @click="toclass(item.no)"> -->
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
  import { ref,reactive,onMounted,onBeforeMount } from 'vue';
  import { useRouter } from "vue-router";
  import { useRoute } from "vue-router";
  import { Toast } from 'vant';
  const axios = require('axios');

  export default {
    name: 'Select',
    setup() {
      const loading = ref(false);
      const finished = ref(false);
      const router = useRouter();
      const route = useRoute();
      const number= route.query.number;
      const batchId= route.query.batchId;
      const email= route.query.email;
      const mustChoseNum = ref(0);
      const courses = reactive({list:[]});
      const selected = reactive({list:[]});
      const pwd = route.query.pwd;//接收密码
      const username = route.query.username;//接收用户名
      const start = route.query.start;
      const end = route.query.end;


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


      //获取课程列表
      function onLoad(){
        //获取已选班级列表
        axios({
          method:'get',
          url:'student/checkselectedclass',
          params:{
            number:number,
          }
        })
        .then(function (res) {
          // for (let i = 0; i < res.data.length; i++) {
          //   selected.list.push(res.data[i]);
          // }
          selected.list=res.data;
          //console.log(selected);
        })
        .catch(function (error) {
            console.log("catch"+error);
            Toast('获取班级信息失败，请检查网络');
        });
        //console.log(selected);
        setTimeout(() =>{
          axios({
            method:'get',
            url:'admin/getcourse',
            params:{
              batch:batchId,
            }
          })
          .then(function (response) {
            //console.log(response.data);
            mustChoseNum.value=0;
            for (let i = 0; i < response.data.length; i++) {
              courses.list.push(response.data[i]);
              courses.list[i].selected=0;//默认未选
              if (courses.list[i].mustchose) {//如果是必选课程
                mustChoseNum.value++;
              }
            }
            //console.log("mustChoseNum="+mustChoseNum.value);
            //console.log("courses.list.length="+courses.list.length);
            for (let i = 0; i < selected.list.length; i++) {
              for (let j = 0; j< courses.list.length; j++) {
                if (selected.list[i].course==courses.list[j].no) {
                  courses.list[j].selected=1;//已选此课程
                  if (courses.list[j].mustchose==1) {//如果此课是必选课程，那么未选的必选课程数量-1
                    mustChoseNum.value--;
                    //console.log("mustChoseNum="+mustChoseNum.value);
                  }
                  break;
                }
              }
            }
            //console.log(mustChoseNum.value);
            //console.log(selected);
            loading.value = false;
            finished.value = true;
          })
          .catch(function (error) {
              console.log("catch"+error);
              Toast('获取课程信息失败，请检查网络');
          });
        },100);
      }

      function toclass(courseid) {
        router.push({path:'/selectclass',query:{number:number,courseid:courseid,email:email,pwd:pwd,username:username,batchId:batchId,start:start,end:end}});
      }

      const back = () => history.back();
      const refresh = () =>router.go(0); 

      return {
        loading,
        finished,
        back,
        courses,
        number,
        toclass,
        onLoad,
        onMounted,
        mustChoseNum,
        batchId,
        selected,
        refresh,
      };
    },
  }
</script>

<style scoped>
  .block-center{
    position: relative;
    height: 100%;
    margin: 2%;
    background-color: white;
    border-radius: 10px;
    text-align: center;
    word-break: keep-all;
  }
  .block{
    position: relative;
    /* height: 150px; */
    margin: 3%;
    background-color: white;
    border-radius: 10px;
  }
  .card{
    position: relative;
    padding: 15px 25px 10px 25px;
  }
  .title-text{
    font-size: 17px;
    padding-bottom: 5px;
  }
  .common-text{
    font-size: 14px;
    padding-top: 5px;
  }
  .must-tag{
    position: relative;
    margin-right: 8px;
  }
  .selected-tag{
    position: relative;
  }
  .toRight{
    text-align: right;
  }
  .right-button{
    position: relative;
    width: 60px;
    height: auto;
    margin-top: 2px;
    margin-left: 85%;
    transform: translate(-85%);
    /* margin-left: 100%;
    transform: translate(-60px); */
  }
</style>