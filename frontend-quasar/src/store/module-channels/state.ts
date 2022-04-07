import { Channel } from 'components/models';

export interface ChannelStateInterface {
  channels: Channel[];
  activeChannel: Channel | null;
  status: 'nothing' | 'pending' | 'success' | 'error';
}

function state(): ChannelStateInterface {
  return {
    channels: [],
    activeChannel: null,
    status: 'nothing',
  };
}

export default state;
