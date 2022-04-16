// @ts-ignore
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository';
import Channel from 'App/Models/Channel';
import Message from 'App/Models/Message';

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelName: string): Promise<Message[]> {
    const channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) => messagesQuery.preload('user'))
      .firstOrFail();
    return channel.messages.map((message) => message.serialize() as Message);
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
