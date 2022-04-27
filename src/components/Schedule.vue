<template>
  <div>
    <van-nav-bar
      title="今日课程"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <!-- 课程列表 -->
    <div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        error-text="加载失败"
        @load="onLoad"
      >
        <van-cell v-for="item in data_in" :key="item" >
          <van-card
            :title="item.title"
            >
            <template #tags>
              <van-tag style="margin-top: 3px; width:155px;" plain type="primary">开始时间：{{item.startDate}}</van-tag>
              <br>
              <van-tag style="margin-top: 3px; width:155px;" plain type="primary">结束时间：{{item.endDate}}</van-tag>
            </template>
            <template #footer>
              <van-tag style="margin-top: 3px;"  plain type="success">已报/上限:{{item.now}}/{{item.max}}</van-tag>
            </template>
          </van-card>
        </van-cell>
        <van-skeleton title avatar round :animate="false" :row="2" avatar-size=40px :style="{margin: '5px' }" />
      </van-list>
    </div>
  </div>
</template>

<script>
  import { ref,reactive } from 'vue';
  import { useRouter } from "vue-router";
  const axios = require('axios');

  export default {
    name: 'Schedule',
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