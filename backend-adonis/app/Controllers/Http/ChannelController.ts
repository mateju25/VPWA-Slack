import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Channel from 'App/Models/Channel';
import PreferenceUserValidator from 'App/Validators/PreferenceUserValidator';
import ChannelValidator from 'App/Validators/ChannelValidator';
import { DateTime } from 'luxon';

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

  public async savePreference({ auth, request }: HttpContextContract) {
    // if invalid, exception
    const data = await request.validate(PreferenceUserValidator);
    await auth.user?.load('preference');
    auth.user?.preference?.$setAttribute('darkMode', data.darkMode);
    auth.user?.preference?.$setAttribute('notificationsOn', data.notificationsOn);
    console.log(auth.user?.preference);
    await auth.user?.preference?.save();

    return auth.user;
  }

  public async createChannel({ auth, request }: HttpContextContract) {
    // if invalid, exception
    const data = await request.validate(ChannelValidator);
    const channel = await Channel.create(data);
    await auth.user?.related('channels').attach({
      [channel.id]: {
        role_id: 1,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await channel.load('owners');
    await channel.load('members');

    return channel;
  }
}
