import type { AxiosError, AxiosRequestConfig } from 'axios';
import { api } from 'src/boot/axios';
import { Channel, Message, User } from 'components/models';
import { ChannelData } from 'src/contracts';

import { BootParams, SocketManager } from './managers/SocketManager';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string;

    this.socket.on('errorMessage', ({ message }) => {
      store.commit('channelStore/SET_ERROR', message);
    });

    this.socket.on('message', (message: Message) => {
      store.commit('channelStore/NEW_MESSAGE', { channel, message });
      if (store.state.authStore.user?.preference.stateName !== 'DND')
        store.commit('channelStore/NEW_NOTIFICATION', { channel, message });
    });

    this.socket.on(
      'messageCurrentlyTyping',
      ({
        receivedChannel,
        user,
        message,
      }: {
        receivedChannel: string;
        user: string;
        message: string;
      }) => {
        store.commit('channelStore/NEW_MESSAGE_TYPING', {
          receivedChannel,
          user,
          message,
        });
      }
    );

    this.socket.on(
      'userJoinChannel',
      ({
        receivedChannel,
        user,
      }: {
        receivedChannel: Channel;
        user: string;
      }) => {
        store.commit('channelStore/ADD_MEMBER', { receivedChannel, user });
      }
    );

    this.socket.on(
      'userKickFromChannel',
      ({
        channelKicked,
        kickedUser,
      }: {
        channelKicked: Channel;
        kickedUser: string;
      }) => {
        store.commit('channelStore/REMOVE_USER_FROM_CHANNEL', {
          receivedChannel: channelKicked,
          username: kickedUser,
        });
        if (
          store.state.channelStore.activeChannel?.name === channelKicked.name &&
          kickedUser === store.state.authStore.user?.username
        ) {
          store.commit('channelStore/REMOVE_CHANNEL', channelKicked);
          store.commit(
            'channelStore/SET_ACTIVE_CHANNEL',
            store.state.channelStore.channels.find(
              (item) => item.channel.name === 'General'
            )?.channel as Channel
          );
        }
      }
    );

    this.socket.on(
      'deleteUserFromChannel',
      ({ receivedChannel, user }: { receivedChannel: Channel; user: User }) => {
        const username = user.username;
        if (receivedChannel.owners.find((item) => item.username === username)) {
          store.commit('channelStore/REMOVE_CHANNEL', receivedChannel);
          if (
            store.state.channelStore.activeChannel?.name ===
            receivedChannel.name
          )
            store.commit(
              'channelStore/SET_ACTIVE_CHANNEL',
              store.state.channelStore.channels.find(
                (item) => item.channel.name === 'General'
              )?.channel as Channel
            );
        } else {
          store.commit('channelStore/REMOVE_USER_FROM_CHANNEL', {
            receivedChannel,
            username,
          });
        }
      }
    );
    this.socket.on(
      'revokeUser',
      ({ receivedChannel, user }: { receivedChannel: Channel; user: User }) => {
        store.commit('channelStore/REMOVE_USER_FROM_CHANNEL', {
          receivedChannel,
          user,
        });
        if (user.id === (store.state.authStore.user as User).id) {
          const general = store.state.channelStore.channels.find(
            (x) => x.channel.name === 'General'
          )?.channel;
          store.commit('channelStore/SET_ACTIVE_CHANNEL', general);
          store.commit('channelStore/REMOVE_CHANNEL', receivedChannel);
        }
      }
    );
    this.socket.on(
      'inviteUser',
      ({ channel, user }: { channel: Channel; user: User }) => {
        // before user accept invitation, channel  will be topped
        const temp = store.state.channelStore.invitations.find(
          (x) => x.channel.name === channel.name
        );
        if (user.id === (store.state.authStore.user as User).id && !temp) {
          console.log(channel, 'invite');
          store.commit('channelStore/ADD_CHANNEL_TO_TOP', channel);
        }
      }
    );
    this.socket.on(
      'userJoined',
      ({
        channel,
        user,
      }: {
        channel: { channel: Channel; topped: boolean };
        user: User;
      }) => {
        console.log(channel);
        if (user.id === (store.state.authStore.user as User).id) {
          store.commit('channelStore/MOVE_ACCEPTED_TO_ALLCHANNELS', channel);
        }
        store.commit('channelStore/ADD_NEW_USER_TO_CHANNEL', { user, channel });
      }
    );
  }
  public deleteChannel(channel: Channel): Promise<Channel> {
    console.log('deleting channel', channel);
    return this.emitAsync('deleteChannel', channel.id);
  }

  public revokeUser({
    user,
    channel,
  }: {
    user: User;
    channel: Channel;
  }): Promise<User> {
    console.log('Revoking user', user.username);
    return this.emitAsync('revokeUser', { user, channel });
  }

  public inviteUser({
    username,
    channel,
  }: {
    username: string;
    channel: Channel;
  }): Promise<User> {
    console.log('Inviting user', username);
    return this.emitAsync('inviteUser', { username, channel });
  }

  public userJoined({
    user,
    channel,
  }: {
    user: User;
    channel: { channel: Channel; topped: boolean };
  }): Promise<User> {
    return this.emitAsync('userJoined', { user, channel });
  }

  public addMessage(message: string): Promise<Message> {
    return this.emitAsync('addMessage', message);
  }

  public addMessageCurrentlyTyping(message: string): Promise<Message> {
    return this.emitAsync('addMessageCurrentlyTyping', message);
  }

  public loadMessages(pagination: number): Promise<Message[]> {
    return this.emitAsync('loadMessages', pagination);
  }

  public joinChannel(data: ChannelData): Promise<Channel> {
    return this.emitAsync('joinChannel', data);
  }

  public kickFromChannel(
    kickedUser: string,
    channel: Channel
  ): Promise<Channel> {
    return this.emitAsync('kickFromChannel', { kickedUser, channel });
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map();

  public connect(name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already connected in channel "${name}"`);
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`);
    this.channels.set(name, channel);
    return channel;
  }

  public disconnect(name: string): boolean {
    const channel = this.channels.get(name);

    if (!channel) {
      return false;
    }

    // disconnect namespace and remove references to socket
    channel.destroy();
    return this.channels.delete(name);
  }

  public in(name: string): ChannelSocketManager | undefined {
    return this.channels.get(name);
  }

  async loadChannels(dontTriggerLogout = false): Promise<{
    joined_channels: Channel[];
    topped_channels: Channel[];
  } | null> {
    return api
      .get('data/channels', { dontTriggerLogout } as AxiosRequestConfig)
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          return null;
        }

        return Promise.reject(error);
      });
  }
}

export default new ChannelService();
