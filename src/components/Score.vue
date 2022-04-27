<template>
  <div>
    <van-nav-bar
      title="成绩"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
  </div>
</template>

<script>
  import { ref,reactive } from 'vue';
  import { useRouter } from "vue-router";
  const axios = require('axios');

  export default {
    name: 'Score',
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