import { Channel, Message } from 'components/models';

export interface ChannelStateInterface {
  loading: boolean,
  error: Error | null,
  channels: { channel: Channel, topped: boolean }[];
  messages: { [channel: string]: Message[] }
  notifications: Message[]
  activeChannel: Channel | null;
  statusChannel: 'pending' | 'success' | 'error';
}

function state(): ChannelStateInterface {
  return {
    channels: [],
    messages: {},
    notifications: [],
    activeChannel: null,
    statusChannel: 'pending',
    loading: false,
    error: null,
  };
}

export default state;
