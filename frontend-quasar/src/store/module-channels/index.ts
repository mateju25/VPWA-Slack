import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { ChannelStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const channelModule: Module<ChannelStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default channelModule;
