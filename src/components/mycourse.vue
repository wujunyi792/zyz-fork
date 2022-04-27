<template>
  <div>
    <van-nav-bar
      title="已选课程"
      left-text="返回"
      left-arrow
      @click-left="back"
    />

    <div class="block-center">
        必修：{{mustChoseNum*mustPoints}}/{{allMust*mustPoints}}学分&emsp;选修：{{selecChoseNum*selecPoints}}/{{allSelec*selecPoints}}学分
    </div>
    <div class="block-center" v-show="isCoincidence">
        <span style="color:red;font-weight:bold;">警告：您有课程时间重合，请检查并退改选</span>
    </div>
    <div class="block-center" v-show="!flagin">
        <span style="color:red;font-weight:bold;">当前不在选课时间内</span>
    </div>
    <!-- 课程列表 -->
    <div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        error-text="加载失败"
        @load="onLoad"
      >
        <div v-for="item in selected.list" :key="item" class="block">
          <van-card class="vancard">
            <template #title>
              <div class="courseText-top">课程名称：{{item.coursename}}</div><br>
              <div class="courseText">班级名称：{{item.name}}</div><br>
              <div class="courseText">上课时间：{{item.time}}</div><br>
              <div class="courseText">上课地点：{{item.location}}</div><br>
              <div class="courseText">授课教师：{{item.teacherName}}</div><br>
            </template>
            <template #tags >
            </template>
            <template #footer>
              <div class="tagtag">
                <van-tag plain type="primary" >已报/上限: {{item.nowpeople}}/{{item.maxPeople}}</van-tag>
              </div>
              <div class="keButton">
                <div @click="tuikeconfirm(item.no)" class="deleteButton" >退课</div>
              </div>
              <!-- <img src="../../static/tuike.png" class="keButton" @click="tuikeconfirm(item.no)" > -->
            </template>
          </van-card>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
  import { ref,reactive,onBeforeMount,onMounted} from 'vue';
  import { useRouter } from "vue-router";
  import { useRoute } from "vue-router";
  import { Toast,Dialog } from 'vant';
  const axios = require('axios');

  export default {
    name: 'Select',
    setup() {
      const loading = ref(false);
      const finished = ref(false);
      const router = useRouter();
      const route = useRoute();
      const number= route.query.number;
      const batchid= route.query.batchId;
      const pwd = route.query.pwd;//接收密码
      const username = route.query.username;//接收用户名
      // const batchid= 3;
      const email= route.query.email;
      const courses = reactive({list:[]});//存储当前批次下的所有课程
      const classes = reactive({list:[]});//存储当前课程下的所有班级
      const selected = reactive({list:[]});//存储用户已选的班级
      const mustChoseNum = ref(0);//统计已选课程中必修课程数量
      const selecChoseNum = ref(0);//统计已选课程中选修课程数量
      const allMust = ref(0);//必修课程的数量
      const allSelec = ref(0);//选修课程的数量
      const mustPoints = ref(2);//单个必修课程的学分
      const selecPoints = ref(1);//单个选修课程的学分
      const isCoincidence = ref(false);//是否有课程时间重复

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
        mustChoseNum.value=0;//统计必修课程数量
        allMust.value=0;//所有必修课程的数量
        let batch=0;
        //获取学生所属批次
        setTimeout(() =>{
          axios({
              method:'get',
              url:'student/showbatch',
              params:{
                number:number,
              }
            })
            .then(function (response) {
              batch=response.data[0].no;
            })
            .catch(function (error) {
                console.log("catch"+error);
                Toast('获取批次信息失败，请检查网络');
            });
        },100);
        //获取已选班级列表
        setTimeout(() =>{
          axios({
            method:'get',
            url:'student/checkselectedclass',
            params:{
              number:number,
            }
          })
          .then(function (res) {
            selected.list=res.data//存储已选班级列表
            //console.log(selected.list);
          })
          .catch(function (error) {
              console.log("catch"+error);
              Toast('获取班级信息失败，请检查网络');
          });
        },200);

        //获取当前批次下的所有课程列表
        setTimeout(() =>{
          axios({
            method:'get',
            url:'admin/getcourse',
            params:{
              batch:batchid,//这里原来是batchid
            }
          })
          .then(function (response) {
            courses.list=response.data;//存储当前批次下的所有课程的列表
          })
          .catch(function (error) {
              console.log("catch"+error);
              Toast('获取课程信息失败，请检查网络');
          });
        },200);

        setTimeout(() =>{
          // console.log(courses.list.length);
          for (let i = 0; i < courses.list.length; i++) 
          {
            if (courses.list[i].mustchose) {//如果是必选课程
              allMust.value++;//统计所有课程中必选课程的数量
              // console.log(allMust.value);
            }
          }
          // console.log("课程数量"+courses.list.length);
          // console.log("总必修数量"+allMust.value);
          allSelec.value = courses.list.length-allMust.value;//计算所有课程中选修课程的数量（课程数量-必修课程数量）
          // console.log("selected.list.length"+selected.list.length);
          for (let i = 0; i < selected.list.length; i++) //遍历已选的班级
          {
            //确定班级所属课程名称及选修必修
            const select = selected.list[i];
            for (let k = 0; k < courses.list.length; k++) 
            {
              const course = courses.list[k];
              if (course.no==select.course) {
                // console.log("course.no"+course.no);
                select.coursename=course.name;
                select.must=course.mustchose;
                if (select.must==1) {
                  mustChoseNum.value++;//统计已选课程中必修课程的数量
                }
              }
            }
            //将班级名称中的时间提取出来分开显示
            // for (let j = 0; j < selected.list[i].name.length; j++) 
            // {
            //   const ch = selected.list[i].name[j];
            //   if (ch=='/') {
            //     selected.list[i].time=selected.list[i].name.slice(j+1);
            //     selected.list[i].name=selected.list[i].name.slice(0,j);
            //   }
            // }
          }
          // console.log("已选课程数量"+selected.list.length);
          // console.log("已选必修课程数量"+mustChoseNum.value);
          selecChoseNum.value=selected.list.length-mustChoseNum.value;//统计已经选修的课程数量（已选课程数量-已选必修课程数量）
          for (let i = 0; i < selected.list.length-1; i++) {
            const time1 = selected.list[i].time;
            for (let j = i+1; j < selected.list.length; j++) {
              const time2 = selected.list[j].time;
              if (time1==time2) {
                isCoincidence.value=true;
                break;
              }
            }
          }
        },500);
        loading.value = false;
        finished.value = true;
      }

      function tuikeconfirm(classid){
        //退课确认框
        if (flagin.value==0) {
          Toast('不在选课时间内！');
          return;
        }else{
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
        judgefull,
        tuike,
        onLoad,
        courses,
        selected,
        mustChoseNum,
        allMust,
        allSelec,
        mustPoints,
        selecPoints,
        selecChoseNum,
        tuikeconfirm,
        isCoincidence,
        judgeTime,
        flagin,
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
      margin-bottom:0px;
      /* background-color:red ; */
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
  .tagtag{
    position: relative;
    margin-bottom:-9.5%;
    margin-right:25%;
    /* margin-left: 20px; */
  }
  .tagtag2{
    position: absolute;
    margin-bottom:-10%;
    /* margin-right:85%; */
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