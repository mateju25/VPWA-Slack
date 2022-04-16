// @ts-ignore
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository';
import { inject } from '@adonisjs/core/build/standalone';
// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepositoryContract';
import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';

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
}
