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

  public async deleteChannel({ socket, auth }: WsContextContract, content: number) {
    // if invalid, exception
    const channel = await this.channelRepository.delete(content, auth);

    // broadcast message to other users in channel
    socket.broadcast.emit('deleteUserFromChannel', { receivedChannel: channel, user: auth.user });

    return channel;
  }

  public async revokeUser({ socket }:  WsContextContract, { user, channel }: { user: User, channel: Channel }){
    const updatedChannel = await this.channelRepository.revokeUser(user.id, channel.id);
    // after delete send all users info to update channels
    socket.nsp.emit('revokeUser', { channel: updatedChannel, user: user });
  }

  public async inviteUser({ socket }:  WsContextContract, { username, channel }: { username: string, channel: Channel }){
    const updatedChannel = await this.channelRepository.inviteUser(username, channel.id);
    const user = await User.findBy('username', username);
    // send info to invited user
    socket.to("user:${user.id}").emit('inviteUser', { channel: updatedChannel, user: user });
  }
}
