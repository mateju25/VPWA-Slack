// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/MessageRepository';
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import { DateTime } from 'luxon';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import { Exception } from '@poppinss/utils';

export default class ChannelRepository implements ChannelRepositoryContract {
  public async findAll(auth: AuthContract): Promise<Channel[]> {
    await auth.user?.load('channels');
    return auth.user?.channels.map((channel) => channel.serialize() as Channel) ?? [];
  }

  public async create(
    { name, isPrivate }: { name: string; isPrivate: boolean },
    auth: AuthContract,
  ): Promise<Channel | null> {
    let channel = await Channel.findBy('name', name);
    if (channel !== null) {
      //existuje kanal s takym nazvom
      await channel.load('owners');
      await channel.load('members');

      await auth.user?.load('channels');
      if (auth.user?.channels.find((channel) => channel.name === name) === undefined) {
        if (!channel.isPrivate) {
          //moze joinovat len public kanal
          //join ako member
          await auth.user?.related('channels').attach({
            [channel.id]: {
              role_id: 2,
              joined: DateTime.now(),
              invited: DateTime.now(),
            },
          });
          await channel.load('members');
        } else {
          //nemoze joinovat privatny kanal
          throw new Exception('Channel is private');
        }
      } else {
        //uz je clen
        throw new Exception('You are already in this channel');
      }
    } else {
      //neexistuje kanal s takym nazvom
      channel = await Channel.create({ name, isPrivate });
      //vytvori kanal ako owner
      await auth.user?.related('channels').attach({
        [channel.id]: {
          role_id: 1,
          joined: DateTime.now(),
          invited: DateTime.now(),
        },
      });
      await channel.load('owners');
      await channel.load('members');
    }

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
