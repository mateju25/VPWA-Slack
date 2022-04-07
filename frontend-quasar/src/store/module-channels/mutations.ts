import { MutationTree } from 'vuex';
import { ChannelStateInterface } from './state';
import { Channel } from 'components/models';

const mutation: MutationTree<ChannelStateInterface> = {
  LOAD_START(state) {
    state.status = 'pending';
  },
  LOAD_SUCCESS(state, channels: Channel[]) {
    state.status = 'success';
    state.channels = channels;
  },
  SET_ACTIVE_GENERAL(state, channels: Channel[]) {
    state.activeChannel = channels.find(
      (item) => item.name === 'General'
    ) as Channel;
  },
  LOAD_ERROR(state) {
    state.status = 'error';
  },
};

export default mutation;
