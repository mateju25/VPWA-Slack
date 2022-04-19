// @ts-ignore
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository';
import Channel from 'App/Models/Channel';
import Message from 'App/Models/Message';

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelName: string, pagination: number): Promise<Message[]> {
    const channel = await Channel.findBy('name', channelName);
    const messages = await Message.query()
      .where('channel_id', channel!.id)
      .preload('user')
      .orderBy('createdAt', 'desc')
      .paginate(pagination, 5);
    return messages.all().reverse();
  }

  public async getNewestMessage(channelName: string): Promise<Message> {
    const channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) => messagesQuery.orderBy('created_at', 'desc').first())
      .firstOrFail();
    return channel.messages[0];
  }

  public async create(channelName: string, userId: number, content: string): Promise<Message> {
    const channel = await Channel.findByOrFail('name', channelName);
    const message = await channel
      .related('messages')
      .create({ written_by: userId, channel_id: channel.id, text: content });
    await message.load('user');
    await message.load('channel');

    return message;
  }
}
