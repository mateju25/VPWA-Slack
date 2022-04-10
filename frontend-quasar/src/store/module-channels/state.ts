import { Channel, Message } from 'components/models';

export interface ChannelStateInterface {
  loading: boolean,
  error: Error | null,
  channels: Channel[];
  messages: { [channel: string]: Message[] }
  activeChannel: Channel | null;
  statusChannel: 'pending' | 'success' | 'error';
}

function state(): ChannelStateInterface {
  return {
    channels: [],
    messages: {},
    activeChannel: null,
    statusChannel: 'pending',
    loading: false,
    error: null,
  };
}

export default state;
