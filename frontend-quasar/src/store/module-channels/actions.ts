import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';
import { channelService } from 'src/services';

const actions: ActionTree<ChannelStateInterface, StateInterface> = {
  async loadChannels({ commit }) {
    try {
      commit('LOAD_START');
      const channels = await channelService.loadChannels();
      commit('LOAD_SUCCESS', channels);
      commit('SET_ACTIVE_GENERAL', channels);
      return channels !== null;
    } catch (err) {
      commit('LOAD_ERROR', err);
      throw err;
    }
  },
};

export default actions;
