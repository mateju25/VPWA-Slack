// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/MessageRepository';
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import { DateTime } from 'luxon';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';

export default class ChannelRepository implements ChannelRepositoryContract {
  public async findAll(auth: AuthContract): Promise<Channel[]> {
    await auth.user?.load('channels');
    return auth.user?.channels.map((channel) => channel.serialize() as Channel) ?? [];
  }

  public async create(data: Object, auth: AuthContract): Promise<Channel> {
    const channel = await Channel.create(data);
    await auth.user?.related('channels').attach({
      [channel.id]: {
        role_id: 1,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await channel.load('owners');
    await channel.load('members');

    return channel;
  }

  public async delete(channelId: number, auth: AuthContract): Promise<Channel> {
    const channel = await Channel.findBy('id', channelId);
    await channel?.load('owners');
    await channel?.load('members');
    if (channel?.members.find((item) => item.id === auth.user?.id)) {
      await channel?.related('members').detach([(auth.user as User).id]);
    }
    if (channel?.owners.find((item) => item.id === auth.user?.id)) {
      await channel?.delete();
    }
    return channel as Channel;
  }
}
