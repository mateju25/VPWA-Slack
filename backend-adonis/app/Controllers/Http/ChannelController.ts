import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ChannelValidator from 'App/Validators/ChannelValidator';
import { inject } from '@adonisjs/core/build/standalone';
// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepositoryContract';

@inject(['Repositories/ChannelRepository'])
export default class ChannelController {
  constructor(private channelRepository: ChannelRepositoryContract) {}

  public async getChannels({ auth }: HttpContextContract) {
    // if invalid, exception
    const channels = await this.channelRepository.findAll(auth);
    return channels;
  }

  public async createChannel({ auth, request }: HttpContextContract) {
    // if invalid, exception
    const data = await request.validate(ChannelValidator);
    const channel = await this.channelRepository.create(data, auth);

    return channel;
  }

  public async deleteChannel({ auth, params }: HttpContextContract) {
    // if invalid, exception
    const channel = await this.channelRepository.delete(params.id, auth);
    return channel;
  }
}
