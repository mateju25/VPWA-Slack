import { Channel, Message } from 'components/models';

export interface ChannelStateInterface {
  loading: boolean,
  error: string | null,
  invitations: { channel: Channel, topped: boolean }[];
  channels: { channel: Channel, topped: boolean }[];
  messages: { [channel: string]: { messages: Message[], pagination: number, allLoaded: boolean }}
  notifications: Message[]
  activeChannel: Channel | null;
  statusChannel: 'pending' | 'success' | 'error';
}

function state(): ChannelStateInterface {
  return {
    channels: [],
    invitations: [],
    messages: {},
    notifications: [],
    activeChannel: null,
    statusChannel: 'pending',
    loading: false,
    error: null,
  };
}

export default state;
