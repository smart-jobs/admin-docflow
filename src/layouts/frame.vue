<template>
  <el-container class="layout" direction="vertical">
    <el-header class="header" :height="layout.headerHeight" :style="{lineHeight: layout.headerHeight}">
      <div class="header-box">
        <naf-logo :width="asideWidth" :shortName="shortName" :nav-mode="navMode" @switch-mode="switchMode" />
        <naf-lite-bar :menu-collapse="menuCollapse" @toggle-menu="toggleMenu" />
      </div>
    </el-header>
    <el-main style="padding: 0;display: flex;">
      <el-container class="main">
        <el-container class="layout">
          <el-aside :width="asideWidth" class="sider" v-show="asideShow">
            <el-scrollbar>
              <naf-sider :menu-items="menuItems" :style="{width: asideWidth}" theme="light" :is-collapse="menuCollapse" />
            </el-scrollbar>
          </el-aside>
          <el-main class="content">
            <el-alert :title="errMsg" type="info" :description="errDesc" show-icon v-if="showError">
            </el-alert>
            <div class="page" ref="pageContainer">
              <scroll-page>
                <router-view />
              </scroll-page>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import config from '@frame/config';
import ScrollPage from '@naf/layouts/scroll-page';
import NafSider from '@naf/frame/sider';
import NafBread from '@naf/frame/bread';
import NafLogo from './logo';
import NafLiteBar from './litebar';

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
    ScrollPage,
    NafSider,
    NafLogo,
    NafLiteBar,
  },
  props: {
    menuItems: { type: Array, required: true },
    // menuCollapse: { type: Boolean, default: false },
  },
  data() {
    return {
      layout: { ...defaultConfig, ...layout },
      showError: false,
      errMsg: '',
      errDesc: '',
      menuCollapse: false,
      shortName: '公文系统',
    };
  },
  methods: {
    toggleMenu() {
      this.menuCollapse = !this.menuCollapse;
    },
  },
  computed: {
    asideWidth() {
      return this.menuCollapse ? layout.asideCollapseWidth : layout.asideExpandWidth;
    },
    asideShow() {
      return true;
    },
  },
  created() {
    // eslint-disable-next-line no-undef
    // if (!dd) {
    //   throw new BusinessError();
    // }
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
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.header {
  padding: 0;
  .header-box {
    background: #20a0ff;
    color: #fff;
    display: flex;
    flex-direction: row;
    padding: 0;
    height: 100%;
  }
}
.sider {
  background: #fff;
  max-height: 100%;
  overflow: initial;
  overflow-y: auto;
  border-right: solid 1px #e6e6e6;
  display: flex;
  flex-direction: column;
  /*.el-menu {
      height: 100%;
    }*/
  .logo {
    flex: 0;
  }
  .el-scrollbar {
    flex: 1;
    // height: 100%;
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
  }
}
</style>
