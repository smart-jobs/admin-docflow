import Vue from 'vue';
import Vuex from 'vuex';
import * as dict from './naf/dict';
import * as corp from './jobs/corp';
import * as campus from './jobs/campus';
import * as jobfair from './jobs/jobfair';
import * as jobinfo from './jobs/jobinfo';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dict,
    jobs: {
      namespaced: true,
      modules: {
        corp,
        campus,
        jobfair,
        jobinfo,
      },
    },
  },
  state: {},
  mutations: {},
  actions: {},
});
