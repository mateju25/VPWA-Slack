import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Channel from 'App/Models/Channel';
import User from 'App/Models/User';
import RegisterUserValidator from 'App/Validators/RegisterUserValidator';

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    // if invalid, exception
    const data = await request.validate(RegisterUserValidator);
    const user = await User.create(data);
    // join user to general channel
    const general = await Channel.findByOrFail('name', 'General');
    await user.related('channels').attach([general.id]);

    return user;
  }

  public async login({ auth, request }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');

    return await auth.use('api').attempt(email, password);
  }

  public async logout({ auth }: HttpContextContract) {
    return auth.use('api').logout();
  }

  public async me({ auth }: HttpContextContract) {
    await auth.user!.load('channels');
    for (const channel of auth.user!.channels) {
      await channel.load('users');
    }
    return auth.user;
  }
}
