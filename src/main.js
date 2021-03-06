import Vue from 'vue';
import App from './AppFrame.vue';
import router from './router';
// import store from './store';
import '@lib/plugins/meta';
import '@lib/plugins/mint-ui';
import '@lib/plugins/axios';
import '@lib/plugins/check-res';
import '@lib/plugins/naf-dict';
import { createStore } from '@lib/utils/store';
import '@lib/style/index.less';

Vue.config.productionTip = false;

const store = createStore();
// Add this.$router into store actions/mutations
store.$router = router;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
