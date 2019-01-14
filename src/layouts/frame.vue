<template>
  <el-container class="main">
    <el-aside :width="asideWidth" class="sider" v-show="asideShow">
      <el-scrollbar>
        <naf-sider :menu-items="menuItems" :style="{width: asideWidth}" theme="light" :is-collapse="menuCollapse" />
      </el-scrollbar>
    </el-aside>
    <el-main class="content">
      <el-alert :title="errMsg" type="info" :description="errDesc" show-icon v-if="showError">
      </el-alert>
      <div class="page" ref="pageContainer">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';
import urljoin from 'url-join';
import Vue from 'vue';
import { createNamespacedHelpers, mapGetters } from 'vuex';
import config from '@frame/config';
import NafSider from '@naf/frame/sider';
import NafBread from '@naf/frame/bread';

const { mapState, mapActions, mapMutations } = createNamespacedHelpers('naf/menu');

const defaultConfig = {
  breadHeight: '24px',
  headerHeight: '64px',
  footerHeight: '48px',
  asideExpandWidth: '256px',
  asideCollapseWidth: '64px',
};

const { layout = {} } = config;

export default {
  name: 'Frame',
  components: {
    NafSider,
  },
  props: {
    menuItems: Array,
  },
  data() {
    return {
      layout: { ...defaultConfig, ...layout },
      showError: false,
      errMsg: '',
      errDesc: '',
    };
  },
  computed: {
    ...mapState({
      menuCollapse: 'collapse',
      items: 'items',
    }),
    ...mapGetters(['platform']),
    asideWidth() {
      return this.menuCollapse ? layout.asideCollapseWidth : layout.asideExpandWidth;
    },
    asideShow() {
      return true;
    },
  },
  created() {
    if(!dd) {
      throw new BusinessError()
    }
  },
  errorCaptured(err, vm, info) {
    this.showError = true;
    this.errMsg = err.message || '处理发生错误';
    this.errDesc = err.details || info || '页面加载过程中发生错误';
  },
};
</script>
<style scoped lang="less">
.layout {
  overflow: hidden;
  .header {
    padding: 0;
  }
  .sider {
    background: #fff;
    max-height: 100%;
    overflow: initial;
    overflow-y: auto;
    border-right: solid 1px #e6e6e6;
    /*.el-menu {
      height: 100%;
    }*/
    .el-scrollbar {
      height: 100%;
      /deep/ .el-scrollbar__wrap {
        // margin-right: 0 !important;
        overflow-x: hidden;
      }
    }
  }
  .main {
    // FOR EDGE
    overflow: hidden;
  }
  .content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0;
    .bread {
      padding: 10px;
    }
    .page {
      display: flex;
      flex: 1;
      padding: 0;
      overflow: hidden;
      iframe {
        flex: 1;
      }
    }
  }
}
</style>
