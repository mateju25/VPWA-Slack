// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/MessageRepository';
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import { DateTime } from 'luxon';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';

export default class ChannelRepository implements ChannelRepositoryContract {
  public async findAll(
    auth: AuthContract,
  ): Promise<{ joined_channels: Channel[]; topped_channels: Channel[] }> {
    await auth.user?.load('channels');
    let topped = [] as Channel[];
    let joined = [] as Channel[];
    auth.user?.channels.forEach((x) => {
      if (x.$extras.pivot_joined) {
        joined.push(x.serialize() as Channel);
      } else {
        topped.push(x.serialize() as Channel);
      }
    });
    // order by created_at desc due to top newest invited channels
    topped.reverse();
    // order by name asc
    joined.sort((a, b) => a.name.localeCompare(b.name));

    return {
      joined_channels: joined,
      topped_channels: topped,
    };
    // return topped.concat(joined);
    // return auth.user?.channels.map((channel) => channel.serialize() as Channel) ?? [];
  }

  public async kickFromChannel(
    { kickedUser, channel }: { kickedUser: string; channel: Channel },
    auth: AuthContract,
  ): Promise<Channel | null> {
    let kickedChannel = await Channel.findBy('name', channel.name);
    let user = await User.findBy('username', kickedUser);

    if (user !== null) {
      await kickedChannel?.load('members');
      await kickedChannel?.load('owners');
      if (
        kickedChannel?.members.find((member) => member.username === user?.username) === undefined
      ) {
        throw new Error('User is not in the channel or is owner of the channel');
      }
      let arrayOfIds = kickedChannel?.members.find((member) => member.username === user?.username)
        ?.$extras.pivot_kickedBy;
      if (arrayOfIds.find((id) => id === auth.user?.id)) {
        throw new Error('You already kicked this user from this channel');
      }
      if (kickedChannel.owners.find((member) => member.username === auth.user?.username)) {
        arrayOfIds.push(auth.user?.id);
        arrayOfIds.push(auth.user?.id);
        arrayOfIds.push(auth.user?.id);
      } else {
        arrayOfIds.push(auth.user?.id);
      }
      await kickedChannel?.related('members').sync(
        {
          [user.id]: {
            kickedBy: JSON.stringify(arrayOfIds),
            kickedAt: DateTime.now(),
          },
        },
        false,
      );
      await kickedChannel?.load('members');
    }
    return kickedChannel;
  }

  public async join(
    { name, isPrivate }: { name: string; isPrivate: boolean },
    auth: AuthContract,
  ): Promise<Channel | null> {
    let channel = await Channel.findBy('name', name);
    if (channel !== null) {
      //existuje kanal s takym nazvom
      await channel.load('owners');
      await channel.load('members');

      await auth.user?.load('channels');
      await auth.user?.load('kickedChannels');
      if (
        auth.user?.channels.find((channel) => channel.name === name) === undefined &&
        auth.user?.kickedChannels.find((channel) => channel.name === name) === undefined
      ) {
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
          throw new Error('Channel is private');
        }
      } else {
        // je kicknuty
        if (
          auth.user?.kickedChannels.find((channel) => channel.name === name)?.$extras.pivot_kickedBy
            .length === 3
        )
          throw new Error('You are permanently kicked from this channel');
        if (
          auth.user?.kickedChannels.length !== 0 &&
          auth.user?.kickedChannels.find((channel) => channel.name === name)?.$extras
            .pivot_kickedAt !== null
        ) {
          await auth.user?.related('kickedChannels').sync(
            {
              [channel.id]: {
                kickedAt: null,
              },
            },
            false,
          );
          await channel.load('members');
        } else {
          //uz je clen a nie je kicknuty
          throw new Error('You are already in this channel');
        }
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
      await channel
        ?.related('members')
        .sync({ [(auth.user as User).id]: { kickedAt: DateTime.now() } }, false);
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
      await user.load('channels');
      if (!user.channels.find((x) => x.id === channelId)) {
        await user.related('channels').attach({
          [channelId]: {
            role_id: 2,
            joined: null,
            invited: DateTime.now(),
          },
        });
      }
    }
    const channel = await Channel.findBy('id', channelId);
    await channel?.load('members');
    await channel?.load('owners');
    return channel as Channel;
  }

  public async userJoined(channelId: number, userId: number): Promise<Channel> {
    const user = await User.findBy('id', userId);
    if (user) {
      user.related('channels').sync(
        {
          [channelId]: {
            joined: DateTime.now(),
          },
        },
        false,
      );
    }
    const channel = await Channel.findBy('id', channelId);
    await channel?.load('members');
    await channel?.load('owners');
    return channel as Channel;
  }
}
