import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';
import { channelService } from 'src/services';
import { Channel } from 'components/models';
import { ChannelData, PreferenceData } from 'src/contracts';

const actions: ActionTree<ChannelStateInterface, StateInterface> = {
  async loadChannels({ commit, dispatch }) {
    try {
      commit('LOAD_START_CHANNEL');
      const channels = await channelService.loadChannels();
      commit('LOAD_SUCCESS', channels);
      commit('SET_ACTIVE_GENERAL', channels);
      await dispatch('loadMessages');
      return channels !== null;
    } catch (err) {
      commit('LOAD_ERROR', err);
      throw err;
    }
  },
  async setActiveChannel({ state, commit, dispatch }, { channel }) {
    try {
      commit('SET_ACTIVE_CHANNEL', channel);
      await dispatch('loadMessages');
      return state.activeChannel !== null;
    } catch (err) {
      throw err;
    }
  },
  async loadMessages({ commit, state }) {
    try {
      commit('LOAD_START_MESSAGE');
      const messages = await channelService.loadMessages((state.activeChannel as Channel).id);
      commit('LOAD_SUCCESS_MESSAGES', messages);
      return messages !== null;
    } catch (err) {
      commit('LOAD_ERROR', err);
      throw err;
    }
  },
  async savePreference({}, data: PreferenceData) {
    try {
      return await channelService.savePreference(data);
    } catch (err) {
      throw err;
    }
  },
  async addChannel({ commit }, data: ChannelData) {
    try {
      const channel = await channelService.addChannel(data);
      commit('ADD_CHANNEL', channel);
      return channel !== null;
    } catch (err) {
      throw err;
    }
  },
};

export default actions;
