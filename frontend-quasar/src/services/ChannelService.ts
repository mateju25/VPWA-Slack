import type { AxiosError, AxiosRequestConfig } from 'axios';
import { api } from 'src/boot/axios';
import { Channel, Message } from 'components/models';
import { ChannelData, PreferenceData, User } from 'src/contracts';

class AuthService {
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

export default new AuthService();
