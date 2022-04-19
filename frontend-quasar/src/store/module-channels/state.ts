import { Channel, Message } from 'components/models';

export interface ChannelStateInterface {
  loading: boolean,
  error: string | null,
  channels: Channel[];
  messages: { [channel: string]: { messages: Message[], pagination: number }}
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
