// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/MessageRepository';
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import { DateTime } from 'luxon';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import { Exception } from '@poppinss/utils';

export default class ChannelRepository implements ChannelRepositoryContract {
  public async findAll(auth: AuthContract): Promise<{ joined_channels:Channel[], topped_channels:Channel[] }> {
    await auth.user?.load('channels');
    let topped = [] as Channel[];
    let joined = [] as Channel[];
    auth.user?.channels.forEach((x) => {
      if(x.$extras.pivot_joined){
        joined.push(x.serialize() as Channel);
      } else {
        topped.push(x.serialize() as Channel);
      }
    });
    // order by created_at desc due to top newest invited channels
    topped.reverse();
    return {
      joined_channels: joined,
      topped_channels: topped
    }
    // return topped.concat(joined);
    // return auth.user?.channels.map((channel) => channel.serialize() as Channel) ?? [];
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

  public async revokeUser(channelId: number, userId: number): Promise<Channel> {
    const channel = await Channel.findBy('id', channelId);
    await channel?.load('members');
    if (channel?.members.find((x) => x.id === userId)) {
      await channel?.related('members').detach([userId]);
    }
    return channel as Channel;
  }

  public async inviteUser(channelId: number, username: string): Promise<Channel> {
    const user = await User.findBy('username', username);
    if (user) {
      user.related('channels').attach({
        [channelId]: {
          role_id: 2,
          joined: null,
          invited: DateTime.now(),
        },
      })
    }
    const channel = await Channel.findBy('id', channelId);
    await channel?.load('members');
    return channel as Channel;
  }
}
