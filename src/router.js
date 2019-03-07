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
    {
      path: '/draft',
      component: () => import(/* webpackChunkName: "docflow_draft" */ './views/draft.vue'),
      children: [
        {
          path: '/draft/:status',
        },
      ],
    },
    {
      path: '/outbox',
      component: () => import(/* webpackChunkName: "docflow_outbox" */ './views/outbox.vue'),
      children: [
        {
          path: '/outbox/:status',
        },
      ],
    },
    {
      path: '/archive',
      component: () => import(/* webpackChunkName: "docflow_archive" */ './views/archive.vue'),
    },
    {
      path: '/feedback',
      redirect: '/outbox/feedback',
    },
    {
      path: '/inbox',
      component: () => import(/* webpackChunkName: "docflow_inbox" */ './views/inbox.vue'),
      children: [
        {
          path: '/inbox/:status',
        },
      ],
    },
  ],
});

export default router;
