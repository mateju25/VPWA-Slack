import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';
import { channelService } from 'src/services';
import { Channel } from 'components/models';
import { ChannelData } from 'src/contracts';

const actions: ActionTree<ChannelStateInterface, StateInterface> = {
  // ACTIONS FOR CHANNEL LOADING
  async loadChannels({ commit , dispatch}) {
    try {
      commit('LOAD_START_CHANNELS');
      const channels = await channelService.loadChannels();
      if (channels === null)
        throw new Error('Channels not found');

      commit('LOAD_SUCCESS_CHANNELS', channels);
      commit('SET_ACTIVE_CHANNEL', channels.find((item) => item.name === 'General') as Channel);

      //connect socket to general
      for (const channel of channels) {
        await dispatch('channelStore/connect', channel.name, { root: true })
      }

      return true;
    } catch (err) {
      commit('LOAD_ERROR');
      throw err;
    }
  },
  async setActiveChannel({ state, commit }, { channel }) {
    try {
      commit('SET_ACTIVE_CHANNEL', channel);
      return state.activeChannel !== null;
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
      commit('REMOVE_CHANNEL', deletedChannel);
      commit('SET_ACTIVE_GENERAL');
      return deletedChannel !== null;
    } catch (err) {
      throw err;
    }
  },

  // ACTIONS FOR MESSAGE LOADING
  async connect ({ commit }, channel: string) {
    try {
      commit('LOADING_START')
      const messages = await channelService.connect(channel).loadMessages()
      commit('LOADING_SUCCESS', { channel, messages })
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },
  async disconnect ({ getters }, channel: string | null) {
    const leaving: string[] = channel !== null ? [channel] : getters.connectedChannels

    leaving.forEach((c) => {
      channelService.disconnect(c)
      // commit('CLEAR_CHANNEL', c)
    })
  },
  async addMessage ({ commit }, { channel, message }: { channel: string, message: string }) {
    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit('NEW_MESSAGE', { channel, message: newMessage })
  }
};

export default actions;
