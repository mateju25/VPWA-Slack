import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
// @ts-ignore
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository';
import { inject } from '@adonisjs/core/build/standalone';
import { DateTime } from 'luxon';
import Channel from 'App/Models/Channel';

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(['Repositories/MessageRepository'])
export default class MessageController {
  constructor(private messageRepository: MessageRepositoryContract) {}

  private static compare(a: DateTime, b: DateTime) {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  }

  public async loadMessages({ params, socket }: WsContextContract) {
    const messages = await this.messageRepository.getAll(params.name);
    const channel = await Channel.findBy('name', params.name);
    if (
      messages.length > 0 &&
      [...messages].sort((a, b) => MessageController.compare(a.createdAt, b.createdAt))[0]
        .createdAt < DateTime.now().minus({ days: 30 })
    ) {
      await channel?.load('owners');
      socket.nsp.emit('deleteUserFromChannel', {
        receivedChannel: channel,
        user: channel?.owners[0],
      });
      await channel?.delete();
      return null;
    } else if (messages.length === 0) {
      if (channel!.createdAt < DateTime.now().minus({ days: 30 })) {
        await channel?.load('owners');
        socket.nsp.emit('deleteUserFromChannel', {
          receivedChannel: channel,
          user: channel?.owners[0],
        });
        await channel?.delete();
        return null;
      }
    }
    return messages;
  }

  public async addMessage({ params, socket, auth }: WsContextContract, content: string) {
    const message = await this.messageRepository.create(params.name, auth.user!.id, content);
    // broadcast message to other users in channel
    socket.broadcast.emit('message', message);
    // return message to sender
    return message;
  }
}
