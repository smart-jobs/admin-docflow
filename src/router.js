import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home.vue';

Vue.use(Router);

const router = new Router({
  // mode: process.env.VUE_APP_ROUTER_MODE || 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/draft',
      component: () => import(/* webpackChunkName: "docflow_draft" */ './views/draft.vue'),
    },
    {
      path: '/outbox',
      component: () => import(/* webpackChunkName: "docflow_outbox" */ './views/outbox.vue'),
    },
    {
      path: '/archive',
      component: () => import(/* webpackChunkName: "docflow_archive" */ './views/archive.vue'),
    },
    {
      path: '/feedback',
      component: () => import(/* webpackChunkName: "docflow_feedback" */ './views/feedback.vue'),
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
