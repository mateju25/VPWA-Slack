import type { AxiosError, AxiosRequestConfig } from 'axios';
import { api } from 'src/boot/axios';
import { Channel, Message, User } from 'components/models';
import { ChannelData } from 'src/contracts';

import { BootParams, SocketManager } from './managers/SocketManager';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('errorMessage', ({message}) => {
      store.commit('channelStore/SET_ERROR', message);
    })

    this.socket.on('message', (message: Message) => {
      store.commit('channelStore/NEW_MESSAGE', { channel, message});
      if (store.state.authStore.user?.preference.stateName !== 'DND')
        store.commit('channelStore/NEW_NOTIFICATION', { channel, message});
    })

    this.socket.on('userJoinChannel', ({receivedChannel, user} : { receivedChannel : Channel, user: string }) => {
      store.commit('channelStore/ADD_MEMBER', { receivedChannel, user});
    })

    this.socket.on('userKickFromChannel', ({channelKicked, kickedUser} : { channelKicked: Channel, kickedUser: string, }) => {
      store.commit('channelStore/REMOVE_USER_FROM_CHANNEL', { receivedChannel: channelKicked, username: kickedUser});
      if (store.state.channelStore.activeChannel?.name === channelKicked.name && kickedUser === store.state.authStore.user?.username) {
        store.commit('channelStore/REMOVE_CHANNEL', channelKicked);
        store.commit('channelStore/SET_ACTIVE_CHANNEL', store.state.channelStore.channels.find((item) => item.name === 'General') as Channel);
      }
    })

    this.socket.on('deleteUserFromChannel', ({receivedChannel, user} : { receivedChannel : Channel, user: User }) => {
      const username = user.username;
      if (receivedChannel.owners.find(item => item.username === username)) {
        store.commit('channelStore/REMOVE_CHANNEL', receivedChannel);
        if (store.state.channelStore.activeChannel?.name === receivedChannel.name)
          store.commit('channelStore/SET_ACTIVE_CHANNEL', store.state.channelStore.channels.find((item) => item.name === 'General') as Channel);
      } else {
        store.commit('channelStore/REMOVE_USER_FROM_CHANNEL', { receivedChannel, username});
      }
    })
  }
  public deleteChannel (channel: Channel): Promise<Channel> {
    return this.emitAsync('deleteChannel', channel.id)
  }

  public addMessage (message: string): Promise<Message> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (pagination: number): Promise<Message[]> {
    return this.emitAsync('loadMessages', pagination)
  }

  public joinChannel (data: ChannelData): Promise<Channel> {
    return this.emitAsync('joinChannel', data)
  }

  public kickFromChannel (kickedUser: string, channel: Channel): Promise<Channel> {
    return this.emitAsync('kickFromChannel', { kickedUser, channel })
  }
}


class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public connect (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already connected in channel "${name}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
    return channel
  }

  public disconnect (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }

  async loadChannels(dontTriggerLogout = false): Promise<Channel[] | null> {
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
