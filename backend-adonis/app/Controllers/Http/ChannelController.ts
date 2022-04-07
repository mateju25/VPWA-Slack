import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Channel from 'App/Models/Channel';

export default class ChannelController {
  public async getChannelsAndRelations({ auth }: HttpContextContract) {
    // if invalid, exception
    console.log(auth.user?.related('channels').query());
    const channels = (await auth.user?.related('channels').query()) as Channel[];

    return channels;
  }
}
