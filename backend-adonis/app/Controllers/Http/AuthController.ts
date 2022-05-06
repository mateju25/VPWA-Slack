import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Channel from 'App/Models/Channel';
import User from 'App/Models/User';
import RegisterUserValidator from 'App/Validators/RegisterUserValidator';
import Preference from 'App/Models/Preference';
import { DateTime } from 'luxon';

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    // if invalid, exception
    const data = await request.validate(RegisterUserValidator);
    const preference = await Preference.create({
      stateName: 'Offline',
      darkMode: true,
      notificationsOn: true,
    });
    const user = await User.create({
      email: data.email,
      username: data.username,
      fullname: data.fullname,
      preference_id: preference.id,
      password: data.password,
    });

    // join user to general channel
    const general = await Channel.findByOrFail('name', 'General');
    await user.related('channels').attach({
      [general.id]: {
        role_id: 2,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });

    return user;
  }

  public async login({ auth, request }: HttpContextContract) {
    const username = request.input('username');
    const user = await User.findBy('username', username);
    const password = request.input('password');
    const email = user === null ? '' : user.email;
    auth.user?.$setAttribute('logged', true);
    await auth.user?.save();
    return await auth.use('api').attempt(email, password);
  }

  public async logout({ auth }: HttpContextContract) {
    auth.user?.$setAttribute('logged', false);
    await auth.user?.save();
    return auth.use('api').logout();
  }

  public async me({ auth }: HttpContextContract) {
    await auth.user!.load('preference');
    auth.user?.$setAttribute('logged', true);
    await auth.user?.save();
    return auth.user;
  }
}
