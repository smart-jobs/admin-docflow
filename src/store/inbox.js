import * as types from './.mutation.js';
import config from '@frame/config';
const { pageSize = 10 } = config;

const api = {
  feedback: '/docflow/inbox/feecback',
  fetch: '/docflow/inbox/fetch',
  query: '/docflow/inbox/query',
};
// initial state
export const state = () => ({
  items: [],
  current: null,
  total: 0,
});
export const actions = {
  async query({ commit }, { status = 'new', paging = {} }) {
    const { page = 1, size = pageSize } = paging;
    const skip = Math.max(0, (page - 1) * size);
    const res = await this.$axios.$get(api.query, { status, skip, size });
    if (res.errcode === 0) {
      commit(types.LOADED, res);
    } else {
      commit(types.LOADED, { data: [], total: 0 });
    }
    return res;
  },
  async fetch({ commit }, { docid }) {
    const res = await this.$axios.$get(api.fetch, { docid });
    if (res.errcode === 0) commit(types.SELECTED, res.data);
    return res;
  },
  async feecback({ commit }, { docid }) {
    const res = await this.$axios.$post(api.feecback, {}, { docid });
    if (res.errcode === 0) commit(types.UPDATED, res.data);
    return res;
  },
};

// mutations
export const mutations = {
  [types.LOADED](state, { data, total }) {
    state.items = data;
    state.total = total;
  },
  [types.SELECTED](state, payload) {
    state.current = payload;
  },
  [types.UPDATED](state, payload) {
    const idx = state.items.findIndex(p => p.id === payload.id);
    state.items.splice(idx, 1, payload);
  },
};
export const namespaced = true;
