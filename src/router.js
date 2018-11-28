import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home.vue';

Vue.use(Router);

const router = new Router({
  mode: process.env.VUE_APP_ROUTER_MODE || 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
    },
  ],
});

export default router;
