import type { AxiosError, AxiosRequestConfig } from 'axios';
import { api } from 'src/boot/axios';
import { Channel, Message } from 'components/models';
import { ChannelData, PreferenceData, User } from 'src/contracts';

import { BootParams, SocketManager } from './SocketManager'

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: Message) => {
      store.commit('channelModule/NEW_MESSAGE', { channel, message })
    })
  }

  public addMessage (message: string): Promise<Message> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (): Promise<Message[]> {
    return this.emitAsync('loadMessages')
  }
}


class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public connect (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`)
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
    console.log(name);
    console.log(this.channels);
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

  async loadMessages(id: number, dontTriggerLogout = false): Promise<Message[] | null> {
    return api
      .get('data/messages/'+id, { dontTriggerLogout } as AxiosRequestConfig)
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          return null;
        }

        return Promise.reject(error);
      });
  }

  async savePreference(data: PreferenceData): Promise<User> {
    const response = await api.post<User>('data/preference', data);
    return response.data;
  }


  async addChannel(data: ChannelData): Promise<User> {
    const response = await api.post<User>('data/channel', data);
    return response.data;
  }

  async deleteChannel(id: number): Promise<User> {
    const response = await api.delete<User>('data/channel/'+id);
    return response.data;
  }
}

export default new ChannelService();
