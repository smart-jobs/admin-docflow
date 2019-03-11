import * as types from './.mutation.js';
import config from '@frame/config';
const { pageSize = 10 } = config;

const api = {
  create: '/docflow/draft/create',
  update: '/docflow/draft/update',
  delete: '/docflow/draft/delete',
  post: '/docflow/draft/post',
  fetch: '/docflow/draft/fetch',
  query: '/docflow/draft/query',
  archive: '/docflow/outbox/archive',
};
// initial state
export const state = () => ({
  items: [],
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
  async create({ commit }, { action, data }) {
    const res = await this.$axios.$post(api.create, data, { action });
    if (res.errcode === 0) commit(types.CREATED, res.data);
    return res;
  },
  async update({ commit }, { id, action, data }) {
    const res = await this.$axios.$post(api.update, data, { id, action });
    if (res.errcode === 0) commit(types.UPDATED, res.data);
    return res;
  },
  async fetch({ commit }, { id }) {
    const res = await this.$axios.$get(api.fetch, { id });
    if (res.errcode === 0) commit(types.SELECTED, res.data);
    return res;
  },
  async delete({ commit }, { id }) {
    const res = await this.$axios.$post(api.delete, {}, { id });
    if (res.errcode === 0) commit(types.DELETED, { id });
    return res;
  },
  async post({ commit }, { id }) {
    const res = await this.$axios.$post(api.post, {}, { id });
    if (res.errcode === 0) commit(types.DELETED, { id });
    return res;
  },
  async archive({ commit }, { id }) {
    const res = await this.$axios.$post(api.archive, {}, { id });
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
  [types.CREATED](state, payload) {
    state.items.push(payload);
  },
  [types.UPDATED](state, payload) {
    const idx = state.items.findIndex(p => p.id === payload.id);
    state.items.splice(idx, 1, payload);
  },
  [types.DELETED](state, { id }) {
    const idx = state.items.findIndex(p => p.id === id);
    state.items.splice(idx, 1);
  },
};
export const namespaced = true;
