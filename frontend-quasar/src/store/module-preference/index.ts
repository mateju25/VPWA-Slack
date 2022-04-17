import { Module } from 'vuex';
import actions from './actions';
import { StateInterface } from 'src/store';
import { PreferenceStateInterface } from './state';

const preferenceStore: Module<PreferenceStateInterface, StateInterface> = {
  namespaced: true,
  actions
};

export default preferenceStore;
