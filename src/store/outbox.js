import * as types from './.mutation.js';
import config from '@frame/config';
const { pageSize = 10 } = config;

const api = {
  finish: '/docflow/outbox/finish',
  archive: '/docflow/outbox/archive',
  remind: '/docflow/outbox/remind',
  fetch: '/docflow/outbox/fetch',
  query: '/docflow/outbox/query',
  posts: '/docflow/outbox/posts',
  feedback: '/docflow/feedback/list',
};
// initial state
export const state = () => ({
  items: [],
  subitems: [],
  feedback: [],
  current: null,
  total: 0,
});
export const actions = {
  async query({ commit }, { status = 'draft', paging = {} }) {
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
  async fetch({ commit }, { id }) {
    const res = await this.$axios.$get(api.fetch, { id });
    if (res.errcode === 0) commit(types.SELECTED, res.data);
    return res;
  },
  async finish({ commit }, { id }) {
    const res = await this.$axios.$post(api.finish, {}, { id });
    if (res.errcode === 0) commit(types.UPDATED, res.data);
    return res;
  },
  async archive({ commit }, { id }) {
    const res = await this.$axios.$post(api.archive, {}, { id });
    if (res.errcode === 0) commit(types.UPDATED, res.data);
    return res;
  },
  async remind({ commit }, { id }) {
    const res = await this.$axios.$post(api.remind, {}, { id });
    return res;
  },
  async queryPosts({ commit }, { docid }) {
    const res = await this.$axios.$get(api.posts, { docid });
    if (res.errcode === 0) {
      commit(types.SUB_LOADED, res);
    } else {
      commit(types.SUB_LOADED, { data: [] });
    }
    return res;
  },
  async queryFeedback({ commit }, { docid }) {
    const res = await this.$axios.$get(api.feedback, { docid });
    if (res.errcode === 0) {
      commit(types.SUB_LOADED, res);
    } else {
      commit(types.SUB_LOADED, { data: [] });
    }
    return res;
  },
  async exportFeedback({ commit }, { docid }) {
    const res = await this.$axios.$get(api.feedback, { docid });
    if (res.errcode === 0) {
      commit(types.SUB_LOADED, res);
    } else {
      commit(types.SUB_LOADED, { data: [] });
    }
    return res;
  },
};

// mutations
export const mutations = {
  [types.LOADED](state, { data, total }) {
    state.items = data;
    state.total = total;
  },
  [types.SUB_LOADED](state, { data }) {
    state.subitems = data;
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
