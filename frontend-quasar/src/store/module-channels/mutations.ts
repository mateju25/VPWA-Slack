import { MutationTree } from 'vuex';
import { ChannelStateInterface } from './state';
import { Channel, Message } from 'components/models';

const mutation: MutationTree<ChannelStateInterface> = {
  LOAD_START_CHANNEL(state) {
    state.statusChannel = 'pending';
  },
  LOAD_START_MESSAGE(state) {
    state.statusMessage = 'pending';
  },
  LOAD_SUCCESS(state, channels: Channel[]) {
    state.statusChannel = 'success';
    state.channels = channels;
  },
  LOAD_SUCCESS_MESSAGES(state, messages: Message[]) {
    state.statusMessage = 'success';
    state.messages = messages;
  },
  SET_ACTIVE_GENERAL(state) {
    state.activeChannel = state.channels.find(
      (item) => item.name === 'General'
    ) as Channel;
  },
  REMOVE_CHANNEL(state, channel: Channel) {
    state.channels = state.channels.filter(
      (item) => item.id !== channel.id
    );
    console.log(state.channels);
    state.statusChannel = 'success';
  },
  ADD_CHANNEL(state, channel: Channel) {
    state.channels.push(channel);
    state.activeChannel = channel;
  },
  SET_ACTIVE_CHANNEL(state, channel: Channel) {
    state.activeChannel = channel;
  },
  LOAD_ERROR(state) {
    state.statusChannel = 'error';
    state.statusMessage = 'error';
  },
};

export default mutation;
