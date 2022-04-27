<template>
  <div>
    <van-nav-bar
      title="首页"
      left-text="退出"
      left-arrow
      @click-left="back"
    />
    <div class="toRight">
      <van-tag :plain="true"  size="medium" @click="showIns" style="margin-right:10px">选课指南</van-tag>
      <van-tag :plain="true"  size="medium" @click="show=true">修改密码</van-tag>
    </div>
    <!-- 个人信息显示 -->
    <div class="flex">
      <div class="left">
        <van-image :src="imageSrc" class="photo"/>
        <!-- <van-image :src="require('../../static/photo1.png')" class="photo"/> -->
      </div>
      <div class="right">
        <div class="information">
          <div class="line">姓名：{{user.name}}</div><br>
          <div class="line">学院：{{user.academy}}</div><br>
          <div class="line">邮箱：{{user.email}}</div><br>
          <div class="line">志愿者编号：{{user.number}}</div><br>
          <!-- <div class="line">志愿者序号：{{user.no}}</div><br> -->
          
        </div>
      </div>
    </div>
    <!-- 快捷功能 -->
    <div class="block">
      <div class="col">
        <van-row justify="center" >
          <van-col span="12" align="center">
              <!-- <van-image :src="require('../../static/select1.png')" class="button1" @click="toSelect()"/> -->
              <van-image :src="require('../../static/select1.png')" class="button1" @click="noticeConfirm()"/>
          </van-col>
          <!-- <van-col span="6" align="center">
              <van-image :src="require('../../static/btn1.png')" class="button" @click="toSignIn()"/>
          </van-col> -->
          <van-col span="12" align="center">
              <van-image :src="require('../../static/mycourse.png')" class="button2" @click="toMycourse()"/>
          </van-col>
          <!-- <van-col span="12" align="center">
              <van-image :src="require('../../static/mycourse.png')" class="button2" @click="toSchedule()"/>
          </van-col> -->
          <!-- <van-col span="6" align="center">
              <van-image :src="require('../../static/btn3.png')" class="button" @click="toScore()"/>
          </van-col> -->
        </van-row>
        <van-row justify="center" >
          <van-col span="12" align="center">
              <span class="font">选 课</span>
          </van-col>
          <van-col span="12" align="center">
              <span class="font">我的课程</span>
          </van-col>
          <!-- <van-col span="6" align="center">
              <span class="font">签到</span>
          </van-col>
          <van-col span="6" align="center">
              <span class="font">成绩</span>
          </van-col> -->
        </van-row>
      </div>
    </div>
    <!-- 用于修改密码的弹出层 -->
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
        <span class="pstext">请输入包含英文字符，无特殊字符的8-13位的新密码</span><br>
        <img src="../../static/submitButton.png" class="newButton" @click="subNew()">
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import { ref,reactive,onMounted, onBeforeMount} from 'vue';
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { Toast,Dialog } from 'vant';
const axios = require('axios');

export default {
  name:'Home',
  setup(){
    const router = useRouter();
    const route = useRoute();
    const user=reactive({
      number:'',//志愿者编号
      no:'',//系统内的序号
      email:'',//邮箱
      name:'',//姓名
      academy:'',//学院
    });
    const newInfo=reactive({
      password:'',
      passwordAgain:'',
    })
    const email = route.query.email;//接收userLogin发送的邮箱（用户名）
    const pwd = route.query.pwd;//接收密码
    const username = route.query.username;//接收用户名
    const noticeText = ref('一、此次选课仅包含线下必修课程，不包括线上的视频课等其他内容，在选课过程中请注意选课时间、任课老师及班级。\n二、通用志愿者培训共7门线下必修课程，完成培训预计需要2到3周。\n三、选课系统开设时间：\n\t1.第一批选课：\n4月27日 12：00 至4月28日 21：00\n\t电子信息学院、通信工程、自动化学院、经济学院、外国语学院预录用志愿者\n2.第二批选课：\n4月29日12：00 至 4月30日 21：00\n\t材料与环境工程学院、管理学院、国际教育学院、会计学院、机械工程学院、计算机学院、理学院、马克思主义学院、人文艺术与数字媒体、法学院、圣光机联合学院、网络空间安全学院、卓越学院预录用志愿者\n\t注：两批次选课将按比例分批开放对应的选课名额。\n四、第一周（5.8）与第二周（5.14-5.15）部分；第二周（5.14-5.15）部分与第三周（5.21周六）课程安排相同，志愿者可酌情安排时间完成课程的学习，最少两个休息日即可完成全部课程。\n五、课堂考核（如未修完必修课程、缺勤、迟到、早退、等情况）将影响最终考核成绩。');
    const imageSrc = ref('')


    //根据志愿者编号末位生成头像
    function createPhoto() {
      let str=user.number;
      let randNum=1;
      // console.log(parseInt(str.slice(-1)));
      randNum=parseInt(str.slice(-1));
      if(randNum>7){
        randNum-=3;
      }
      if(randNum==0){
        randNum+=1;
      }
      // randNum=Math.floor(Math.random()*7)+1;//随机randNum为1-7//生成随机数，用于随机图片
      switch (randNum){
        case 1:
          imageSrc.value=require('../../static/4.png');
          break;
        case 2:
          imageSrc.value=require('../../static/2.png');
          break;
        case 3:
          imageSrc.value=require('../../static/3.png');
          break;
        case 4:
          imageSrc.value=require('../../static/1.png');
          break;
        case 5:
          imageSrc.value=require('../../static/5.png');
          break;
        case 6:
          imageSrc.value=require('../../static/6.png');
          break;
        case 7:
          imageSrc.value=require('../../static/7.png');
          break;
        default:
          imageSrc.value=require('../../static/1.png');
      }
    }

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


    //进入页面时同步一次用户信息
    onMounted(()=>{
        axios({
            method:'get',
            url:'student/getstudent',
            params:{
              email:email,
            }
          }
        )
        .then(function (response) {
          user.name=response.data[0].name;
          user.number=response.data[0].number;
          user.no=response.data[0].no;
          user.academy=response.data[0].academy;
          user.email=response.data[0].email;
          if(user.name=='章珺'){
            Toast('热烈欢迎珺姐大美女！！！！');
          }
          createPhoto();
        })
        .catch(function (error) {
            console.log("catch"+error);
            Toast('用户信息同步失败，请检查网络');
        });
        
    });

    

    //修改密码弹出层
    const show = ref(false);//这里需要改为false才能正常使用

    function subNew() {
      if (newInfo.password!=newInfo.passwordAgain) {
        Toast("密码输入不一致！请重新输入");
        newInfo.password='';
        newInfo.passwordAgain='';
        return;
      }
      //console.log(newInfo.password.length);
      if (newInfo.password.length<8||newInfo.password.length>13) {
        Toast("请确认新密码长度为8-13位！");
        newInfo.password='';
        newInfo.passwordAgain='';
        return;
      }
      let cnt =0;//统计密码中英文字符的数量
      for (let i = 0; i < newInfo.password.length; i++) {
        const ch = newInfo.password[i];
        if (!((ch>='0'&&ch<='9')||(ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z'))) {
          Toast("请确认新密码中不包含特殊字符");
          newInfo.password='';
          newInfo.passwordAgain='';
          return;
        }
        if ((ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z')) {
          cnt++;
        }
      }
      // console.log(cnt);
      if (cnt==0) {
        Toast("请确认新密码包含英文字符");
        newInfo.password='';
        newInfo.passwordAgain='';
        return;
      }
      axios({
        method:'get',
        url:'user/changepassword',
        params:{
          password:newInfo.password,
          username:user.email,
        },
      })
      .then(function (response) {
        if (response.data.statuscode==1) {
          Toast('提交成功');
        }else if(response.data.statuscode==0){
          Toast('提交失败');
        }
      })
      .catch(function (error) {
          console.log("catch"+error);
          Toast('提交失败，请检查网络');
      });
      show.value=false;
        
    }

    function noticeConfirm(){//选课指南
      let flag=true;//是否需要弹出选课指南
      axios({
        method:'get',
        url:'user/login',
        params:{
          username:user.email,
          password:user.number,
          userlevel:1,
        }
      })
      .then(function (response) {
        if (response.data.statuscode==3) {//如果登录成功，说明密码没有修改过，弹出选课指南
          flag=true;
        }else if(response.data.statuscode==0){
          Toast('系统错误');
          router.go(0);
        }else if(response.data.statuscode==2){
          Toast('系统错误');
          router.go(0);
        }else if(response.data.statuscode==1){//如果密码错误，说明修改过密码，不弹出选课指南,直接跳转
          flag=false;
          toSelect();
        }
      })
      .catch(function (error) {
          console.log("catch"+error);
          Toast('跳转失败，请检查网络');
      });
      setTimeout(() => {
        if (flag) {
          Dialog.confirm({
            title:'选课指南',
            message:noticeText,
            messageAlign:"left",
          })
            .then(() => {
              toSelect();
            })
            .catch(() => {
              // on cancel
            });
        }
      }, 100);
    }
      
    function showIns() {
      Dialog.confirm({
        title:'选课指南',
        message:noticeText,
        messageAlign:"left",
        showCancelButton:false,
      })
        .then(() => {
          
        })
        .catch(() => {
          // on cancel
        });
    }

    //页面切换函数
    function toSelect() {
      router.push({path:'/batches',query:{number:user.number,email:email,pwd:pwd,username:username}});//需要批次选择时使用这行
      // router.push({path:'/courses',query:{number:user.number,batchId:1,email:email}});//不需要批次选择时使用这行
    }
    function toMycourse() {
      router.push({path:'/mybatches',query:{number:user.number,email:email,pwd:pwd,username:username}});
    }
    function toSignIn() {
      Toast('功能暂未开放，敬请期待...');
      //router.push({path:'/signin'});
    }
    function toSchedule() {
      Toast('功能暂未开放，敬请期待...');
      //router.push({path:'/schedule'});
    }
    function toScore() {
      Toast('功能暂未开放，敬请期待...');
      //router.push({path:'/score'});
    }
    const back = () => history.back();
    return{
      user,
      toSelect,
      toSignIn,
      toSchedule,
      toScore,
      toMycourse,
      back,
      onMounted,
      subNew,
      show,
      newInfo,
      noticeConfirm,
      imageSrc,
      showIns,
      createPhoto,
    };
  },
}
</script>

<style scoped>
  .flex{
    display: flex;
    height: 100%;
    margin: 2%;
    background-color: white;
    border-radius: 5px;
  }
  .block{
    height: 100%;
    margin: 2%;
    background-color: white;
    border-radius: 5px;
  }
  .photo{
    width:80px;
    height: auto;
    left:50%;
    top:50%;
    transform: translate(-50%, -50%);
  }
  .information{
    position: relative;
    margin-left: -10px;
    margin-top:28px;
    margin-bottom: 10px;
    word-break: keep-all;
    font-size: 14px;
    /* font-family: "黑体"; */
  }
  .flex .left{
    flex:1;
    /* margin-left: 10px; */
  }
  .flex .right{
    flex:2;
    margin-left: 10px;
  }
  .col{
    padding-top:20px;
    padding-bottom:20px;
  }
  .button1{
    margin-top: 8px ;
    height:42px;
    width:42px;
  }
  .button2{
    margin-top: 5px ;
    height:auto;
    width:50px;
  }
  .font{
    font-size: 14px;
    word-break: keep-all;
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
    font-size:15px;
    color:gray;
    word-break: keep-all;
    margin-left: 5%;
  }
  .line{
    position: relative;
    /* background-color: red; */
    margin-top: -5px;
    margin-bottom: -5px;
    /* font-weight: 800; */
    /* color:rgb(150, 150, 150); */
  }
  .toRight{
    position: relative;
    margin-top: 2%;
    text-align: right;
    margin-right: 2%; 
  }
</style>