import { MutationTree } from 'vuex';
import state, { ChannelStateInterface } from './state';
import { Channel, Message, User } from 'components/models';

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
    console.log(state.channels, channel)
    state.channels = state.channels.filter(
      (item) => item.id !== channel.id
    );
    state.statusChannel = 'success';
  },
  REMOVE_USER_FROM_CHANNEL(state, { receivedChannel, user }: { receivedChannel: Channel, user: User }) {
    const foundChannel = state.channels.find(
      (item) => item.id === receivedChannel.id
    );
    if (foundChannel !== undefined) {
      foundChannel.members = foundChannel.members.filter(
        (item) => item.id !== user.id
      );
    }
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
  UPDATE_CHANNELS(state, {user, userState}: {user: User, userState: string}) {
    state.channels.forEach((x) => {
      x.members.every((m) => {
        if(m.username === user.username){
          m.preference.stateName = userState;
          return false;
        }
        return true;
      })
      x.owners.every((m) => {
        if(m.username === user.username){
          m.preference.stateName = userState;
          return false;
        }
        return true;
      })
    });
  },
  ADD_CHANNEL_TO_START(state, channel: Channel){
    state.channels.unshift(channel);
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
  NEW_MESSAGE (state, { channel, message }: { channel: string, message: Message}) {
    state.messages[channel].push(message)
  },
  NEW_NOTIFICATION (state, { message }: { channel: string, message: Message }) {
    state.notifications.push(message);
  },
  REMOVE_NOTIFICATIONS (state) {
    state.notifications = [];
  }
};

export default mutation;
