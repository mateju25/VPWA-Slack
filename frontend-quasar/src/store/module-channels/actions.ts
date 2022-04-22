import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';
import { channelService } from 'src/services';
import { Channel, User } from 'components/models';
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
  async updateChannels({ commit }, {user, userState}: {user: User, userState: string}){
    commit('UPDATE_CHANNELS', {user: user, userState: userState});
  },
  async setActiveChannel({ state, commit }, { channel }) {
    try {
      commit('SET_ACTIVE_CHANNEL', channel);
      return state.activeChannel !== null;
    } catch (err) {
      throw err;
    }
  },

  async addChannel({ commit, state }, data: ChannelData) {
    try {
      const channel = await channelService.in('General')?.joinChannel(data);
      if (channel !== null) {
        commit('ADD_CHANNEL', channel);
        channelService.connect(channel!.name);
        commit('SET_ACTIVE_CHANNEL', state.channels.find(channel => channel.name === state.activeChannel?.name));
      }
      return true;
    } catch (err) {
    }
  },

  async kickFromChannel({}, { kickedUser, channel }) {
    try {
      await channelService.in(channel.name)?.kickFromChannel(kickedUser, channel);
      return true;
    } catch (err) {
    }
  },

  async deleteChannel({ state, commit }, { channel }) {
    try {
      const deletedChannel = await channelService.in(channel.name)?.deleteChannel(channel);
      channelService.disconnect(channel.name);
      commit('REMOVE_CHANNEL', deletedChannel);
      commit('SET_ACTIVE_CHANNEL', state.channels.find((item) => item.name === 'General') as Channel);
      return deletedChannel !== null;
    } catch (err) {
      throw err;
    }
  },

  // ACTIONS FOR MESSAGE LOADING
  async connect ({ commit }, channel: string) {
    try {
      commit('LOADING_START')
      await channelService.connect(channel);
      commit('LOADING_INIT', { channel })
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },
  async loadMoreMessages ({state, commit }, { channel, pagination }: { channel: string, pagination: number }) {
    try {
      const messages = await channelService.in(channel)!.loadMessages(pagination)
      if (messages.length !== 0) {
        if (state.messages[channel].pagination == pagination) {
          commit('LOADING_SUCCESS', { channel, messages })
          commit('INC_PAGINATION', { channel })
        }
      } else {
        commit('ALL_LOADED', { channel })
        throw new Error('No more messages');
      }
    } catch (err) {
      throw err
    }
  },
  async disconnect ({ getters }, channel: string | null) {
    const leaving: string[] = channel !== null ? [channel] : getters.connectedChannels

    leaving.forEach((c) => {
      channelService.disconnect(c)
    })
  },
  async addMessage ({ commit }, { channel, message }: { channel: string, message: string }) {
    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit('NEW_MESSAGE', { channel, message: newMessage })
  }
};

export default actions;
