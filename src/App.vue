<template>
  <div class="background">
    <!-- 上方图片+文字 -->
    <div class="title-img">
      <img src="../static/top-window.png" class="img">
      <span class="text">杭州电子科技大学志愿者培训系统</span>
      <!-- <span class="text">志愿者培训系统</span> -->
      <!-- 个人中心和设置按钮 -->
      <!-- <div class="imgButton">
        <img src="../static/person.png" class="person" @click="toPerson()">
        <img src="../static/setting.png" class="setting" @click="toSetting()">
      </div> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { ref,reactive,onMounted} from 'vue';
import { useRouter } from "vue-router";
const axios = require('axios');

export default {
  name: 'App',
  setup() {
    const router = useRouter();

    onMounted(()=>{
      document.title="杭州电子科技大学志愿者培训系统";
      // document.title="志愿者培训系统";
    })
    //页面切换函数
    function toPerson() {
      router.push({path:'/person'});
    }
    function toSetting() {
      router.push({path:'/setting'});
    }
    function getrouter() {
      //console.log(window.location.href);
    }
    return {
      toPerson,
      toSetting,
      getrouter,
    };
  },
}
</script>

<style>
.commonButton{
  background-color: rgb(130, 89, 235);
  width: 60px;
  height: 18px;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  line-height: 18px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing:2px;
  color: white;
  /* margin-left: 60vw; */
  box-shadow: 0 0 5px 1px rgb(156, 123, 238);
}
.deleteButton{
  background-color: rgb(255, 98, 98);
  width: 60px;
  height: 18px;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  line-height: 18px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing:2px;
  color: white;
  margin-left: 60vw;
  box-shadow: 0 0 4px 1px rgb(255, 98, 98);
}
</style>

<style scoped>
#app {
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  height: 100%;
  /* "lucida Grande", Verdana, 'Microsoft YaHei'; */
}
.background{
  background-color: rgb(238, 243, 243);
  width: 100%;
  height: 100%;
  min-height: 100vh;
  /* background-image: url(../static/homeBackground.png);
  background-size: auto 100%; */
}

.title-img{
  position: relative;
  height: 80px;
  width: 100%;
  text-align:center;

}
.text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 23px;
  word-break: keep-all;
  font-weight:bold;
}
.img{
  width: 100%;
  height: 100%;
}
.imgButton{
  position: absolute;
  bottom: 7%;
  right: 2%;
  height: 20%;
  width: auto;
}
.person{
  height: 100%;
  width: auto;
}
.setting{
  height: 100%;
  width: auto;
  margin-left: 10px;
}
</style>
