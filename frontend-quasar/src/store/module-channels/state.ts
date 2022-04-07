import { Channel, Message } from 'components/models';

export interface ChannelStateInterface {
  channels: Channel[];
  messages: Message[];
  activeChannel: Channel | null;
  statusChannel: 'nothing' | 'pending' | 'success' | 'error';
  statusMessage: 'nothing' | 'pending' | 'success' | 'error';
}

function state(): ChannelStateInterface {
  return {
    channels: [],
    messages: [],
    activeChannel: null,
    statusChannel: 'nothing',
    statusMessage: 'nothing',
  };
}

export default state;
