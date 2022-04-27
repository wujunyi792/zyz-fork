<template>
  <!--登陆界面（选择用户或管理员身份）--------------------------------------------------------------------------------------------- -->
  <div class="div1" >
    <!-- <img src="../../static/logo.png" alt="图片被销毁了哦" height="200" width="200" class="image1"> -->
    <br><br>
    <div class="buttonlogin">
      <van-form @submit="subPass()" >
        <van-cell-group inset>
          <van-field v-model="login.username" label="邮箱" placeholder="请输入邮箱" />
          <van-field v-model="login.password" type="password" label="密码" placeholder="请输入密码" />
          <van-radio-group v-model="login.userlevel" direction="horizontal" class="select">
            <!-- <van-radio name="1">学生</van-radio> -->
            <!-- <van-radio name="2">老师</van-radio> -->
            <!-- <van-radio name="3">管理员</van-radio> -->
          </van-radio-group>
        </van-cell-group>
        <div @click="subPass()" class="commonButton">登录</div>
        <!-- <div class="submitButton">
          <div @click="subPass()" class="commonButton">登录</div>
        </div> -->
        <!-- <img src="../../static/loginButton.png" class="submitButton" @click="subPass()"> -->
      </van-form>
      
      <!-- <span class="pstext">首次登录密码为您的志愿者编号</span> -->
    </div>
    <van-popup
      v-model:show="show"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-form  class="newInfo">
        <van-cell-group inset>
          <!-- <van-field v-model="newInfo.number" label="学号" placeholder="请输入学号" /> -->
          <van-field v-model="newInfo.password" type="password" label="密码" placeholder="请输入密码" />
          <van-field v-model="newInfo.passwordAgain" type="password" label="确认密码" placeholder="请再次输入密码" />
        </van-cell-group>
        <img src="../../static/submitButton.png" class="newButton" @click="subNew()">
      </van-form>
    </van-popup>
  </div>
</template>

<script>
  import { reactive, ref } from 'vue';
  import { useRouter } from "vue-router";
  import { Toast } from 'vant';

  const axios = require('axios');

  export default {
    setup(){
      const router = useRouter();
      const flag=ref(false);//这里需要改为false才能正常判断用户名密码是否正确
      const login=reactive({
        username:"",
        password:"",
        userlevel:"1",
      })
      const newInfo=reactive({
        // number:'',
        password:'',
        passwordAgain:'',
      })

      //修改密码弹出层
      const show = ref(false);//这里需要改为false才能正常使用//这里设为false，因为未使用该组件

      function subNew() {
        if (newInfo.password!=newInfo.passwordAgain) {
          Toast("密码输入不一致！请重新输入");
          newInfo.password='';
          newInfo.passwordAgain='';
          return;
        }else{
          axios({
            method:'get',
            url:'user/changepassword',
            params:{
              password:newInfo.password,
            },
          })
          .then(function (response) {
            if (response.data.statuscode==1) {
              Toast('提交成功');
              if(login.userlevel==1)//如果用户是学生
              {
                router.push({path:'/home',query:{number:login.username}});
              }
            }else if(response.data.statuscode==0){
              Toast('提交失败');
            }
          })
          .catch(function (error) {
              console.log("catch"+error);
              Toast('提交失败，请检查网络');
          });
        }
        //console.log(newInfo);
      }

      function subPass(){
        //判空
        if (login.username==""||login.password=="") {
          Toast("请输入信息！");
          return;
        }
        //axios
        axios({
          method:'get',
          url:'user/login',
          params:login
        })
        .then(function (response) {
          if (response.data.statuscode==3) {
            flag.value=true;
            Toast('登录成功');
          }else if(response.data.statuscode==0){
            flag.value=false;
            Toast('输入错误');
          }else if(response.data.statuscode==2){
            flag.value=false;
            Toast('未找到用户');
          }else if(response.data.statuscode==1){
            flag.value=false;
            login.password='';
            Toast('密码错误');
          }
        })
        .catch(function (error) {
            console.log("catch"+error);
            Toast('登陆失败，请检查网络');
        });
        setTimeout(() =>{//延时
          //flag.value=true;//正式上传需要注释此行
          if(flag.value==true){
            if(login.userlevel==1)//如果用户是学生
            {
              router.push({path:'/home',query:{email:login.username,pwd:login.password,username:login.username}});
            }
          }
          // if (flag.value&&login.password!=login.username) {//登录成功并且用户名与密码不一致，说明不是首次登录
          //   //console.log("登录成功！");
          //   if(login.userlevel==1)//如果用户是学生
          //   {
          //     router.push({path:'/home',query:{number:login.username}});
          //   }
          // }else if(login.password==login.username&&flag.value){//登录成功并且用户名与密码一致，说明是首次登录
          //   show.value=true;
          // }
        },100);
      }
      return{
        login,
        subPass,
        flag,
        show,
        newInfo,
        subNew,
      }   
    }
  }
</script>
<style scoped>
  /*适应PC端 宽度大于1000px*/
  @media screen and (min-width: 1000px) {
    .buttonlogin{
      width: 300px;
      position: absolute;
      margin-left: 50%; 
      margin-top: 15%;
      /* background-color: red; */
      transform: translate(-50%,-15%);
      text-align: center;
    }
  }
  /*适应pad端 宽度在640-1000之间*/
  @media screen and (min-width: 640px) and (max-width: 1000px) {
    .buttonlogin{
      width: 300px;
      position: absolute;
      margin-left: 50%; 
      margin-top: 50%;
      /* background-color: red; */
      transform: translate(-50%,-50%);
      text-align: center;
    }
  }
  /*适应移动端 宽度小于640*/
  @media screen and (max-width: 639px){
    .buttonlogin{
      width: 300px;
      position: absolute;
      margin-left: 50%; 
      margin-top: 50%;
      /* background-color: red; */
      transform: translate(-50%,-50%);
      text-align: center;
    }
  }

  .div1{
    position: relative;
    height: calc(100vh - 80px);
    width: auto;
    /* background-color: green; */
  }
  .image1{
    position: absolute;
    margin-left: 50%;
    transform: translate(-50%);
  }
  /* .submitButton{
    position: absolute;
    width:150px;
    height: 30px;
    margin-top: 30px;
    transform: translate(-50%);
  }
  .commonButton{
    position: absolute;
    width:120px;
    height: 27px;
    margin-top: 30px;
    line-height: 27px;
    transform: translate(-50%);
    font-size: 19px;
    font-weight: 550;
  } */
  /* .submintButton{
    position: relative;
    height: 200px;
    margin-top: 100px;
    margin-left: 50%;
    transform: translate(-50%);
    background-color: red;
  } */
  .commonButton{
    position: absolute;
    margin-left: 50%;
    margin-top: 20px;
    transform: translate(-50%);
    width:120px;
    height: 27px;
    line-height: 27px;
    font-size: 19px;
    font-weight: 550;
  }
  .select{
    margin-left: 45%; 
    transform: translate(-40%);
  }
  .newInfo{
    margin-top: 10px;
    position: relative;
  }
  .newButton{
    position: absolute;
    width:100px;
    height: auto;
    margin-left: 50%; 
    transform: translate(-50%);
  }
  .pstext{
    position: relative;
    font-size:15px;
    color:gray;
    word-break: keep-all;
    /* margin-left:50%;
    transform: translate(-50%); */
  }
</style>