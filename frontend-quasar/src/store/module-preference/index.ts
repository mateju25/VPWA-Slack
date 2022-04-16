import { Module } from 'vuex';
import state, { PreferenceStateInterface } from './state';
import actions from './actions';
import mutations from './mutations';
import { StateInterface } from 'src/store';


const preferenceStore: Module<PreferenceStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  mutations,
  state
};

export default preferenceStore;
