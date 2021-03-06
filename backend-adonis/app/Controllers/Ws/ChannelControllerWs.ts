// @ts-ignore
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository';
import { inject } from '@adonisjs/core/build/standalone';
// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepositoryContract';
import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(['Repositories/ChannelRepository'])
export default class ChannelControllerWs {
  constructor(private channelRepository: MessageRepositoryContract) {}

  public async joinChannel(
    { socket, auth }: WsContextContract,
    {
      name,
      isPrivate,
    }: {
      name: string;
      isPrivate: boolean;
    },
  ) {
    if (name !== undefined && isPrivate !== undefined) {
      let channel = null;
      try {
        channel = await this.channelRepository.join({ name, isPrivate }, auth);
      } catch (err) {
        socket.emit('errorMessage', {
          message: err.message,
        });
        return null;
      }
      await auth.user?.load('preference');
      // broadcast message to other users in channel
      socket.broadcast.emit('userJoinChannel', { receivedChannel: channel, user: auth.user });

      return channel;
    }
    return null;
  }

  public async kickFromChannel(
    { socket, auth }: WsContextContract,
    {
      kickedUser,
      channel,
    }: {
      kickedUser: string;
      channel: Channel;
    },
  ) {
    if (kickedUser !== undefined && channel !== undefined) {
      let channelKicked = null;
      try {
        channelKicked = await this.channelRepository.kickFromChannel(
          {
            kickedUser,
            channel,
          },
          auth,
        );
      } catch (err) {
        socket.emit('errorMessage', {
          message: err.message,
        });
        return channel;
      }
      socket.nsp.emit('userKickFromChannel', {
        channelKicked: channelKicked,
        kickedUser: kickedUser,
      });
      return channelKicked;
    }
    return channel;
  }

  public async deleteChannel({ socket, auth }: WsContextContract, content: number) {
    // if invalid, exception
    const channel = await this.channelRepository.delete(content, auth);

    // broadcast message to other users in channel
    socket.broadcast.emit('deleteUserFromChannel', { receivedChannel: channel, user: auth.user });

    return channel;
  }

  public async revokeUser(
    { socket }: WsContextContract,
    { user, channel }: { user: User; channel: Channel },
  ) {
    const updatedChannel = await this.channelRepository.revokeUser(channel.id, user.id);
    // after delete send all users info to update channels
    socket.nsp.emit('revokeUser', { receivedChannel: updatedChannel, user: user });
  }

  public async inviteUser(
    { socket }: WsContextContract,
    { username, channel }: { username: string; channel: Channel },
  ) {
    const updatedChannel = await this.channelRepository.inviteUser(channel.id, username);
    const user = await User.findBy('username', username);
    // send info to invited user
    socket.broadcast.emit('inviteUser', { channel: updatedChannel, user: user });
  }

  public async userJoined(
    { socket }: WsContextContract,
    { user, channel }: { user: User; channel: { channel: Channel; topped: boolean } },
  ) {
    // db request
    const editedChannel = await this.channelRepository.userJoined(channel.channel.id, user.id);
    // socket info about connected user
    socket.nsp.emit('userJoined', {
      channel: {
        channel: editedChannel,
        topped: false,
      },
      user: user,
    });
  }

  public async deleteInvitation({ auth }: WsContextContract, channel: Channel) {
    return await this.channelRepository.deleteInvitation(channel.id, auth.user?.id);
  }
}
