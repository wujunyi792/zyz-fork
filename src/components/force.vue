<template>
  <div>
    <van-nav-bar
      title="错误"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="center">用户名或密码错误！</div>
  </div>
</template>

<script>
  import { ref,reactive } from 'vue';
  import { useRouter } from "vue-router";
  const axios = require('axios');

  export default {
    name: 'Setting',
    setup() {
      const back = () => history.back();
      return {
        back,
      };
    },
  }
</script>

<style scoped>
.center{
  position: absolute;
  margin-top: 50%;
  margin-left: 50%;
  transform: translate(-50%,-50%);
}
</style>