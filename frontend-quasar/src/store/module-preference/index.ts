import { Module } from 'vuex';
import state, { PreferenceStateInterface } from './state';
import actions from './actions';
import { StateInterface } from 'src/store';


const preferenceStore: Module<PreferenceStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  state
};

export default preferenceStore;
