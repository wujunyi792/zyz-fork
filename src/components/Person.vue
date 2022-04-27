<template>
  <div>
    <van-nav-bar
      title="个人中心"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
  </div>
</template>

<script scoped>
  import { ref,reactive } from 'vue';
  import { useRouter } from "vue-router";
  import { useRoute } from "vue-router";
  const axios = require('axios');

  export default {
    name: 'Person',
    setup() {
      const back = () => history.back();
      return {
        back,
      };
    },
  }
</script>

<style>

</style>