import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);

import {Button} from 'vant';
import {Form} from 'vant';
import {Field} from 'vant';
import { Cell, CellGroup } from 'vant';
import {Picker} from 'vant';
import {Popup} from 'vant';
import {Toast} from 'vant';
import {Dialog} from 'vant';
import { NavBar } from 'vant';
import { Card } from 'vant';
import { Sticky } from 'vant';
import { Tag } from 'vant';
import { RadioGroup, Radio } from 'vant';
import { List } from 'vant';
import { Icon } from 'vant';
import { Stepper } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
import { DatetimePicker } from 'vant';
import { Uploader } from 'vant';
import { Skeleton } from 'vant';
import { Swipe } from 'vant';
import { SwipeItem } from 'vant';
import { Divider } from 'vant';
import { Image as VanImage } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
import { Col, Row } from 'vant';
import { PasswordInput, NumberKeyboard } from 'vant';
import { PullRefresh } from 'vant';
// import { Overlay } from 'vant';
// import { Loading } from 'vant';

app.use(Button);
app.use(Form);
app.use(Field);
app.use(Cell);
app.use(CellGroup);
app.use(Picker);
app.use(Popup);
app.use(Toast);
app.use(Dialog);
app.use(NavBar);
app.use(Card);
app.use(Sticky);
app.use(Tag);
app.use(Radio);
app.use(RadioGroup);
app.use(List);
app.use(Icon);
app.use(Stepper);
app.use(Checkbox);
app.use(CheckboxGroup);
app.use(DatetimePicker);
app.use(Uploader);
app.use(Skeleton);
app.use(Swipe);
app.use(SwipeItem);
app.use(Divider);
app.use(VanImage);
app.use(DropdownMenu);
app.use(DropdownItem);
app.use(Col);
app.use(Row);
app.use(PasswordInput);
app.use(NumberKeyboard);
app.use(PullRefresh);
// app.use(Overlay);
// app.use(Loading);

import{ createRouter,createWebHashHistory} from 'vue-router'

const home = ()=>import('./components/Home.vue');
const person = ()=>import('./components/Person.vue');
const schedule = ()=>import('./components/Schedule.vue');
const score = ()=>import('./components/Score.vue');
const batches = ()=>import('./components/Batches.vue');
const courses = ()=>import('./components/Courses.vue');
const selectclass = ()=>import('./components/Selectclass.vue');
const setting = ()=>import('./components/Setting.vue');
const signin = ()=>import('./components/Signin.vue');
const userLogin = ()=>import('./components/userLogin.vue');
const mycourse = ()=>import('./components/mycourse.vue');
const mybatches = ()=>import('./components/mybatches.vue');
const force = ()=>import('./components/force.vue');

const routes = [
    {path:'/',redirect:'/userLogin'},
    {path:'',redirect:'/userLogin'},
    {path: '/home', component: home},
    {path: '/person', component: person},
    {path: '/schedule', component: schedule},
    {path: '/score', component: score},
    {path: '/batches', component: batches},
    {path: '/courses', component: courses},
    {path: '/selectclass', component: selectclass},
    {path: '/setting', component: setting},
    {path: '/signin', component: signin},
    {path: '/userLogin', component: userLogin},
    {path: '/mycourse', component: mycourse},
    {path: '/mybatches', component: mybatches},
    {path: '/force', component: force},
]

const router = createRouter({
    history:createWebHashHistory(process.env.NODE_ENV),
    routes,
})

import axios from 'axios';
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'https://zyz.hdu.edu.cn/';
// axios.defaults.baseURL = 'http://124.222.182.152:8080/demo_war/';
// app.use(router,axios);
app.use(VueAxios,axios);

app.use(router);
// app.prototype.axios = axios;
//app.config.globalProperties.$http=axios;

router.isReady().then(() => app.mount('#app'))
//app.use(router,axios).mount('#app');
