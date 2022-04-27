<template>
    <van-nav-bar
      title="签到"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="block2">
      <span class="text2">课堂签到</span>
    </div>
    <!-- 密码输入框 -->
    <van-password-input
      length=4
      info=""
      :error-info="errorInfo"
      :value="value"
      :mask="false"
      :focused="showKeyboard"
      @focus="showKeyboard = true"
    /> 
    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model="value"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
</template>

<script>
  import { ref,reactive,watch} from 'vue';
  import { useRouter } from "vue-router";
  import { Toast } from 'vant';
  const axios = require('axios');

  export default {
    name: 'Signin',
    setup() {
      //签到码输入
      const value = ref('');
      const showKeyboard = ref(true);
      const errorInfo = ref('');
      watch(value, (newVal) => {
        //这里加axios提交签到码
        if (newVal.length === 4 && newVal !== '1234') {
          Toast('签到码错误');
          // errorInfo.value = '签到码错误';
          value.value = '';
        } else {
          errorInfo.value = '';
        }
      });

      const back = () => history.back();

      return {
        value,
        showKeyboard,
        errorInfo,
        back,
      };
    },
  }
</script>

<style scoped>
  .block2{
    position: relative;
    height: 10%;
    margin: 4%;
    background-color: white;
    border-radius: 5px;
  }
  .text2{ 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgb(164, 203, 246);
    font-size: 20px;
    word-break: keep-all;
  }
</style>