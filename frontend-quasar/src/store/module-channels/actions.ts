import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';
import { channelService } from 'src/services';
import { Channel } from 'components/models';
import { ChannelData, PreferenceData } from 'src/contracts';

const actions: ActionTree<ChannelStateInterface, StateInterface> = {
  async loadChannels({ commit }) {
    try {
      commit('LOAD_START_CHANNEL');
      const channels = await channelService.loadChannels();
      commit('LOAD_SUCCESS', channels);
      commit('SET_ACTIVE_GENERAL');
      // await dispatch('loadMessages');
      return channels !== null;
    } catch (err) {
      commit('LOAD_ERROR', err);
      throw err;
    }
  },
  async setActiveChannel({ state, commit }, { channel }) {
    try {
      commit('SET_ACTIVE_CHANNEL', channel);
      // await dispatch('loadMessages');
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
  async deleteChannel({ commit }, { channel }) {
    try {
      const deletedChannel = await channelService.deleteChannel(channel.id);
      console.log(deletedChannel);
      commit('REMOVE_CHANNEL', deletedChannel);
      commit('SET_ACTIVE_GENERAL');
      return deletedChannel !== null;
    } catch (err) {
      throw err;
    }
  },
  async connect ({ commit }, channel: string) {
    try {
      commit('LOADING_START')

      const messages = await channelService.connect(channel).loadMessages()
      console.log(messages)
      commit('LOADING_SUCCESS', { channel, messages })
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },
  async disconnect ({ getters, commit }, channel: string | null) {
    const leaving: string[] = channel !== null ? [channel] : getters.joinedChannels

    leaving.forEach((c) => {
      channelService.disconnect(c)
      commit('CLEAR_CHANNEL', c)
    })
  },
  async addMessage ({ commit }, { channel, message }: { channel: string, message: string }) {
    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit('NEW_MESSAGE', { channel, message: newMessage })
  }
};

export default actions;
