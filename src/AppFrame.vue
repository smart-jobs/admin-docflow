<template>
  <div id="app">
    <div class="weui-loadmore" v-if="loading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <frame :menuItems="menuItems" v-else> </frame>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Frame from '@/layouts/frame';

export default {
  components: {
    Frame,
  },
  name: 'App',
  metaInfo: {
    title: '公文系统',
    titleTemplate: '公文系统 - %s',
  },
  async mounted() {
    // const res = await this.load();
    // this.$checkRes(res, () => {});
  },
  computed: {
    ...mapState({
      loading: 'loading',
      menuItems: state => state.menu.items,
    }),
  },
};
</script>

<style scoped lang="less">
#app {
  height: 100%;
  //width: 100%;
}
.weui-loadmore {
  position: absolute;
  top: 40%;
  width: 100%;
}
</style>
