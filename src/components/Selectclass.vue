<template>
  <div>
    <van-nav-bar
      title="班级列表"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <!-- <van-button @click="refresh">刷新</van-button> -->
    <div class="block-center" v-show="isSelected">
        <span>当前课程已选</span>
    </div>
    <div class="block-center" v-show="!isSelected">
        <span>当前课程未选</span>
    </div>
    <div class="block-center" v-show="!flagin">
        <span style="color:red;font-weight:bold;">当前不在选课时间内</span>
    </div>
    <!-- 课程列表 -->
    <div v-show="flagin">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        error-text="加载失败"
        @load="onLoad"
      >
        <div v-for="item in classes.list" :key="item" class="block">
          <van-card class="vancard">
            <template #title>
              <div class="courseText-top">班级名称：{{item.name}}</div><br>
              <div class="courseText">上课时间：{{item.time}}</div><br>
              <div class="courseText">上课地点：{{item.location}}</div><br>
              <div class="courseText">授课教师：{{item.teacherName}}</div><br>
            </template>
            <template #tags >
            </template>
            <template #footer>
              <div class="tagtag2">
                <van-tag  plain type="success" v-show="item.selected">已选</van-tag>
              </div>
              <div class="tagtag">
              <van-tag plain type="primary" >已报/上限: {{item.nowpeople}}/{{item.maxPeople}}</van-tag>
              </div>
              <div>
                <div @click="xuankeconfirm(item.no)" v-show="judgefull(item.nowpeople,item.maxPeople)" class="commonButton">选课</div>
                <div @click="tuikeconfirm(item.no)" class="deleteButton">退课</div>
              </div>
              <!-- <img src="../../static/xuanke.png" class="keButton" @click="xuanke(item.no)" v-show="judgefull(item.nowpeople,item.maxPeople)">
              <img src="../../static/tuike.png" class="keButton" @click="tuike(item.no)" > -->
            </template>
          </van-card>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
  import { ref,reactive,onBeforeMount, onMounted} from 'vue';
  import { useRouter } from "vue-router";
  import { useRoute } from "vue-router";
  import { Toast ,Dialog} from 'vant';
  const axios = require('axios');

  export default {
    name: 'Select',
    setup() {
      const loading = ref(false);
      const finished = ref(false);
      const router = useRouter();
      const route = useRoute();
      const number= route.query.number;
      const courseid= route.query.courseid;
      const email= route.query.email;
      const isSelected = ref(0);
      const classes = reactive({list:[]});//存储当前课程下的所有班级
      const selected = reactive({list:[]});//存储用户已选的班级id
      const pwd = route.query.pwd;//接收密码
      const username = route.query.username;//接收用户名
      const startTime = route.query.start;//二十四小时制，个位数前面加零，四位年份-月-日-时-分
      const endTime = route.query.end;
      const flagin = ref(0);//初值为不在选课时间内
      
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
      //判断是否在选课时间内
      function judgeTime() {
        const mydate=new Date();
        const year = String(mydate.getFullYear());
        var month = String(mydate.getMonth()+1);
        var day =String(mydate.getDate());
        var hour =String(mydate.getHours());
        var minute = String(mydate.getMinutes());
        if (month.length==1) {
          month="0"+month;
        }
        if (day.length==1) {
          day="0"+day;
        }
        if (hour.length==1) {
          hour="0"+hour;
        }
        if (minute.length==1) {
          minute="0"+minute;
        }
        const startYear=startTime.slice(0,4);
        const startMonth=startTime.slice(5,7);
        const startDay=startTime.slice(8,10);
        const startHour=startTime.slice(11,13);
        const startMinute=startTime.slice(14,16);
        const endYear=endTime.slice(0,4);
        const endMonth=endTime.slice(5,7);
        const endDay=endTime.slice(8,10);
        const endHour=endTime.slice(11,13);
        const endMinute=endTime.slice(14,16);
        //console.log(year+"-"+month+"-"+day+"-"+hour+"-"+minute);
        //console.log(startYear+"-"+startMonth+"-"+startDay+"-"+startHour+"-"+startMinute);
        //console.log(endYear+"-"+endMonth+"-"+endDay+"-"+endHour+"-"+endMinute);
        let flag1=0;//标识是否在开始时间之后
        let flag2=0;//标识是否在结束时间之前
        //判断是否在开始时间之后
        if(year>startYear){
          flag1=1;//在范围内
        }else if(year==startYear){
          if (month>startMonth) {
            flag1=1;
          }else if(month==startMonth){
            if (day>startDay) {
              flag1=1;
            }else if(day==startDay){
              if (hour>startHour) {
                flag1=1;
              }else if(hour==startHour){
                if (minute>=startMinute) {
                  flag1=1;
                }else{
                  flag1=0;
                }
              }else{
                flag1=0;
              }
            }else{
              flag1=0;
            }
          }else{
            flag1=0;
          }
        }else{
          flag1=0;
        }
        //判断是否在结束时间之前
        if(year<endYear){
          flag2=1;//在范围内
        }else if(year==endYear){
          if (month<endMonth) {
            flag2=1;
          }else if(month==endMonth){
            if (day<endDay) {
              flag2=1;
            }else if(day==endDay){
              if (hour<endHour) {
                flag2=1;
              }else if(hour==endHour){
                if (minute<=endMinute) {
                  flag2=1;
                }else{
                  flag2=0;
                }
              }else{
                flag2=0;
              }
            }else{
              flag2=0;
            }
          }else{
            flag2=0;
          }
        }else{
          flag2=0;
        }
        if (flag1&&flag2) {
          flagin.value=1;
        }else{
          flagin.value=0;
        }
        // console.log(flagin.value);
      }


      onMounted(()=>{
        judgeTime();
      })
      
      function onLoad(){
        isSelected.value=0;
        //获取已选班级列表
        axios({
          method:'get',
          url:'student/checkselectedclass',
          params:{
            number:number,
          }
        })
        .then(function (res) {
           selected.list=res.data
        })
        .catch(function (error) {
            console.log("catch"+error);
            Toast('获取班级信息失败，请检查网络');
        });
        //console.log(selected);
        //获取当前课程下的班级列表

        setTimeout(() =>{//延时,不延时会导致读不到数组长度
            axios({
            method:'get',
            url:'admin/getclass',
            params:{
              course:courseid,
            }
          })
          .then(function (response) {
            for (let i = 0; i < response.data.length; i++) 
            {
              //classes.list.push(response.data[i]);
              classes.list=response.data
              classes.list[i].selected=0;//默认未选
              //console.log(selected);
              //console.log("selected.list.length="+selected.list.length);
              //console.log("length="+length);
              //遍历判断是否已选此班级
              for (let k = 0; k < selected.list.length; k++) 
              {
                  if (selected.list[k].no==classes.list[i].no) 
                  {
                    //console.log(k);
                    classes.list[i].selected=1;//已选此班级
                    isSelected.value++;
                  }
              }
              //将班级名称中的时间提取出来分开显示
              // for (let j = 0; j < classes.list[i].name.length; j++) {
              //   const ch = classes.list[i].name[j];
              //   if (ch=='/') {
              //     classes.list[i].time=classes.list[i].name.slice(j+1);
              //     classes.list[i].name=classes.list[i].name.slice(0,j);
              //   }
              // }
            }
            loading.value = false;
            finished.value = true;
            //classes.list=response.data
          })
          .catch(function (error) {
              console.log("catch"+error);
              Toast('获取班级信息失败，请检查网络');
          });
        },100);
        // console.log(isSelected.value);
      }

      function xuankeconfirm(classid){
        //退课确认框
        Dialog.confirm({
          message:
            '确认选课？',
        })
          .then(() => {
            xuanke(classid);
          })
          .catch(() => {
            // on cancel
          });
      }

      function tuikeconfirm(classid){
        //退课确认框
        Dialog.confirm({
          message:
            '确认退课？',
        })
          .then(() => {
            tuike(classid);
          })
          .catch(() => {
            // on cancel
          });
      }

      function xuanke(classid) {
        let info={
          name:'',
          number:number,
          classes:classid,
          course:courseid,
        };
        //用邮箱获取学生姓名
        axios({
            method:'get',
            url:'student/getstudent',
            params:{
              email:email,
            }
        })
        .then(function (response) {
          //console.log(response);
          info.name=response.data[0].name;
        })
        .catch(function (error) {
            console.log("catch"+error);
            Toast('用户信息获取失败，请检查网络');
        });
        setTimeout(() =>{//延时
          //console.log(info);
          axios({
              method:'get',
              url:'student/chooseclass',
              params:info,
          })
          .then(function (response) {
            if (response.data.statuscode>=1) {
              Toast('选课成功');
              for (let i = 0; i <classes.list.length; i++) {
                if (classes.list[i].no==classid) {
                  classes.list[i].selected=1;
                }
              }
              router.go(0);
            }else{
              Toast('选课失败');
            }
          })
          .catch(function (error) {
              console.log("catch"+error);
              Toast('选课失败，请检查网络');
          });
        },100);
      }

      function tuike(classid) {
        let info={
          number:number,
          classes:classid,
        }
        axios({
            method:'get',
            url:'student/exitclass',
            params:info,
        })
        .then(function (response) {
          if (response.data.statuscode>=1) {
            Toast('退课成功');
            for (let i = 0; i <classes.list.length; i++) {
              if (classes.list[i].no==classid) {
                classes.list[i].selected=0;
              }
            }
            router.go(0);
          }else{
            Toast('退课失败');
          }
        })
        .catch(function (error) {
            console.log("catch"+error);
            Toast('退课失败，请检查网络');
        });
      }

      function judgefull(Nowpeople,maxpeople){
        if (Nowpeople>=maxpeople) {
          return false;
        }else{
          return true;
        }
      }
      const back = () => history.back();
      const refresh = () =>router.go(0);
      return {
        loading,
        finished,
        back,
        refresh,
        classes,
        number,
        xuanke,
        judgefull,
        tuike,
        onLoad,
        courseid,
        selected,
        tuikeconfirm,
        xuankeconfirm,
        isSelected,
        flagin,
        judgeTime,
      };
    },
  }
</script>

<style scoped>
  /*适应PC端 宽度大于900*/
  @media screen and (min-width: 900px) {
    .tagtag{
      position: relative;
      margin-right:80vw;
      margin-bottom:-34px;
      /* margin-bottom:-2%;
      margin-right:20vh; */
      /* margin-left: 20px; */
    }
    .tagtag2{
      position: absolute;
      /* margin-bottom:-20%; */
      /* margin-right:85%; */
    }
    .commonButton{
      position: relative;
      width:40px;
      height:15px;
      margin-left: 80vw;
    }
    .deleteButton{
      position: relative;
      width:40px;
      height:15px;
      margin-left: calc(80vw + 73px);
      margin-top: -35px;
    }
  }
  /*适应pad端 宽度大于470,小于899px*/
  @media screen and (min-width: 469px) and (max-width:899px) {
    .tagtag{
      position: relative;
      margin-right:55vw;
      margin-bottom:-34px;
      /* margin-bottom:-5%;
      margin-right:20vw; */
      /* margin-left: 20px; */
    }
    .tagtag2{
      position: absolute;
      margin-bottom:-10%;
      /* margin-right:85%; */
    }
    .commonButton{
      position: relative;
      width:40px;
      height:15px;
      margin-left: 60vw;
    }
    .deleteButton{
      position: relative;
      width:40px;
      height:15px;
      margin-left: calc(60vw + 73px);
      margin-top: -35px;
    }
  }
  /*适应移动端*/
  @media screen and (max-width: 469px){
    .tagtag{
      position: relative;
      margin-right:43vw;
      margin-bottom:-34px;
      /* margin-bottom:-9.5%;
      margin-right:43%; */
      /* margin-left: 20px; */
    }
    .tagtag2{
      position: absolute;
      margin-bottom:-10%;
      /* margin-right:85%; */
    }
    .commonButton{
      position: relative;
      width:40px;
      height:15px;
      margin-left: 50vw;
    }
    .deleteButton{
      position: relative;
      width:40px;
      height:15px;
      margin-left: calc(50vw + 73px);
      margin-top: -35px;
    }
  }
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
    margin-top: -10px;
  }
  .courseText-top{
    font-size: 14px;
    margin-top: 15px;
  }
  .keButton{
    position: relative;
    width:7vh;
    height:auto;
    /* height: 30px;
    width: auto; */
    /* background-color: red; */
    margin-left: 10px;
    /* margin-bottom: 0px; */
  }
  .block-center{
    position: relative;
    height: 100%;
    margin: 2%;
    background-color: white;
    border-radius: 10px;
    text-align: center;
    word-break: keep-all;
  }
  
</style>