import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';
import { channelService } from 'src/services';
import { Channel, User } from 'components/models';
import { ChannelData } from 'src/contracts';

const actions: ActionTree<ChannelStateInterface, StateInterface> = {
  // ACTIONS FOR CHANNEL LOADING
  async loadChannels({ commit , dispatch, state}) {
    try {
      commit('LOAD_START_CHANNELS');
      const channels = await channelService.loadChannels();
      if (channels === null)
        throw new Error('Channels not found');

      commit('LOAD_SUCCESS_CHANNELS', channels);
      commit('SET_ACTIVE_CHANNEL', channels.joined_channels.find((item) => item.name === 'General') as Channel);
      console.log(channels);
      console.log(state.activeChannel);
      //connect socket to general
      for (const channel of channels.joined_channels) {
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
  async setActiveChannel({ state, commit },  channel: Channel ) {
    try {
      commit('SET_ACTIVE_CHANNEL', channel);
      return state.activeChannel !== null;
    } catch (err) {
      throw err;
    }
  },

  async addChannel({ state, commit }, data: ChannelData) {
    await channelService.addChannel(data).then((channel) => {
      commit('ADD_CHANNEL', channel);
      channelService.connect(channel.name);
    }).catch(err => {
      throw err;
    });
    return state.activeChannel;
  },
  async deleteChannel({ state, commit }, { channel }) {
    try {
      const deletedChannel = await channelService.in(channel.name)?.deleteChannel(channel);
      channelService.disconnect(channel.name);
      commit('REMOVE_CHANNEL', deletedChannel);
      commit('SET_ACTIVE_CHANNEL', state.channels.find((item) => item.channel.name === 'General')?.channel as Channel);
      return deletedChannel !== null;
    } catch (err) {
      throw err;
    }
  },

  async revokeUser({state}, { user }){
    const channel = state.activeChannel as Channel;
    channelService.in(channel.name)?.revokeUser({ user, channel });
  },

  async inviteUser({ state }, username: string){
    const channel = state.activeChannel as Channel;
    channelService.in('General')?.inviteUser({ username, channel });
  },

  async changeToppedToFalse({ dispatch }, {user, channel}: {user: User, channel: { channel: Channel, topped: boolean }}){
    // db request + socket info about connected user + connect channel
    await dispatch('channelStore/connect', channel.channel.name, { root: true });
    await channelService.in(channel.channel.name)?.userJoined({ user, channel });
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
