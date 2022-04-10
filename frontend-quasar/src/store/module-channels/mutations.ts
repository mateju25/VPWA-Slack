import { MutationTree } from 'vuex';
import { ChannelStateInterface } from './state';
import { Channel, Message } from 'components/models';

const mutation: MutationTree<ChannelStateInterface> = {
  // MUTATIONS FOR CHANNEL LOADING
  LOAD_START_CHANNELS(state) {
    state.statusChannel = 'pending';
  },
  LOAD_SUCCESS_CHANNELS(state, channels: Channel[]) {
    state.statusChannel = 'success';
    state.channels = channels;
  },
  REMOVE_CHANNEL(state, channel: Channel) {
    state.channels = state.channels.filter(
      (item) => item.id !== channel.id
    );
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
  },

  // MUTATIONS FOR MESSAGES LOADING
  LOADING_START (state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS (state, { channel, messages }: { channel: string, messages: Message[] }) {
    state.loading = false
    state.messages[channel] = messages
  },
  LOADING_ERROR (state, error) {
    state.loading = false
    state.error = error
  },
  NEW_MESSAGE (state, { channel, message }: { channel: string, message: Message }) {
    state.messages[channel].push(message)
  }
};

export default mutation;
