import { Channel, Message } from 'components/models';

export interface ChannelStateInterface {
  loading: boolean,
  error: Error | null,
  active: string | null,
  channels: Channel[];
  messages: { [channel: string]: Message[] }
  activeChannel: Channel | null;
  statusChannel: 'nothing' | 'pending' | 'success' | 'error';
  statusMessage: 'nothing' | 'pending' | 'success' | 'error';
}

function state(): ChannelStateInterface {
  return {
    channels: [],
    messages: {},
    activeChannel: null,
    statusChannel: 'nothing',
    statusMessage: 'nothing',
    loading: false,
    error: null,
    active: null,
  };
}

export default state;
