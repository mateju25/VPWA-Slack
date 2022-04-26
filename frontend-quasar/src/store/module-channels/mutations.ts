import { MutationTree } from 'vuex';
import { ChannelStateInterface } from './state';
import { Channel, Message, User } from 'components/models';

const mutation: MutationTree<ChannelStateInterface> = {
  // MUTATIONS FOR CHANNEL LOADING
  LOAD_START_CHANNELS(state) {
    state.statusChannel = 'pending';
  },
  LOAD_SUCCESS_CHANNELS(state, channels: { joined_channels:Channel[], topped_channels:Channel[] }) {
    channels.topped_channels.forEach((x) => state.invitations.push({
      channel: x,
      topped: true
    }));
    channels.joined_channels.forEach((x) => state.channels.push({
      channel: x,
      topped: false
    }));
    state.statusChannel = 'success';
  },
  REMOVE_CHANNEL(state, channel: Channel) {
    console.log(state.channels, channel)
    state.channels = state.channels.filter(
      (item) => item.channel.id !== channel.id
    );
    state.statusChannel = 'success';
  },
  REMOVE_USER_FROM_CHANNEL(state, { receivedChannel, user }: { receivedChannel: Channel, user: User }) {
    const foundChannel = state.channels.find(
      (item) => item.channel.id === receivedChannel.id
    );
    if (foundChannel !== undefined) {
      foundChannel.channel.members = foundChannel.channel.members.filter(
        (item) => item.id !== user.id
      );
    }
    state.statusChannel = 'success';
  },
  ADD_CHANNEL(state, channel: Channel) {
    state.channels.push({
      channel: channel,
      topped: false
    });
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
      x.channel.members.every((m) => {
        if(m.username === user.username){
          m.preference.stateName = userState;
          return false;
        }
        return true;
      })
      x.channel.owners.every((m) => {
        if(m.username === user.username){
          m.preference.stateName = userState;
          return false;
        }
        return true;
      })
    });
  },
  ADD_CHANNEL_TO_TOP(state, channel: Channel){
    state.invitations.unshift({
      channel: channel,
      topped: true
    });
  },
  MOVE_ACCEPTED_TO_ALLCHANNELS(state, channel: { channel: Channel, topped: boolean }){
    state.invitations = state.invitations.filter((x) => x.channel.id !== channel.channel.id);
    state.channels.push(channel);
    state.channels.sort((a, b) => a.channel.name.localeCompare(b.channel.name));
  },
  ADD_NEW_USER_TO_CHANNEL(state, {user, channel}: {user: User, channel: { channel: Channel, topped: boolean }}){
    const index = state.channels.findIndex((x) => {
      return x.channel.id === channel.channel.id;
    });
    state.channels[index].channel.members.push(user);
    state.channels.sort((a, b) => a.channel.name.localeCompare(b.channel.name));
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
