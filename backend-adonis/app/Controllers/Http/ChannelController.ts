import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Channel from 'App/Models/Channel';

export default class ChannelController {
  public async getChannelsAndRelations({ auth }: HttpContextContract) {
    // if invalid, exception
    await auth.user?.load('channels');
    return auth.user?.channels;
  }

  public async getMessages({ params }: HttpContextContract) {
    // if invalid, exception
    const channel = await Channel.find(params.id);
    if (channel === null) return [];
    await channel?.load('messages');
    const messages = channel.messages;

    return messages;
  }
}
