import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';

const getters: GetterTree<ChannelStateInterface, StateInterface> = {
  connectedChannels (context) {
    return Object.keys(context.messages)
  },
};

export default getters;
