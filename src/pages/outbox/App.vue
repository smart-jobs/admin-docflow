<template>
  <scroll-page id="app">
    <div class="weui-loadmore" v-if="loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <frame :menu-items="menuItems" v-else />
  </scroll-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ScrollPage from '@naf/layouts/scroll-page';
import Frame from '@/layouts/frame';

export default {
  components: {
    ScrollPage,
    Frame,
  },
  name: 'App',
  metaInfo: {
    title: '公文系统',
    titleTemplate: '公文系统 - %s',
  },
  data() {
    return {
      menuItems: [
        {
          title: '我的发文',
          icon: 'news',
          children: [
            {
              title: '待发公文',
              path: '/draft',
              icon: 'caogao',
            },
            {
              title: '已发公文',
              path: '/draft/other',
              icon: 'doc1',
            },
          ],
        },
        {
          title: '中心发文',
          icon: 'news',
          children: [
            {
              title: '在办公文',
              path: '/outbox',
              icon: 'doc1',
            },
            {
              title: '已办公文',
              path: '/outbox/done',
              icon: 'column',
            },
            {
              title: '归档公文',
              path: '/outbox/archive',
              icon: 'column',
            },
            {
              title: '公文回执',
              path: '/outbox/feedback',
              icon: 'column',
            },
          ],
        },
      ],
    };
  },
  async mounted() {
    // const res = await this.load();
    // this.$checkRes(res, () => {});
  },
  computed: {
    ...mapState(['loading']),
  },
};
</script>

<style scoped>
.weui-loadmore {
  position: absolute;
  top: 40%;
  width: 100%;
}
</style>
