import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import persistedState from './persistedState';
import createState from './createState';

Vue.use(Vuex);

export const createStore = initialState => new Vuex.Store({
  state: createState(initialState),
  plugins: [persistedState],
  // @ts-ignore
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions,
  },
});

export default createStore({});
