import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PreferenceUserValidator from 'App/Validators/PreferenceUserValidator';

export default class PreferenceController {
  public async savePreference({ auth, request }: HttpContextContract) {
    // if invalid, exception
    const data = await request.validate(PreferenceUserValidator);
    await auth.user?.load('preference');
    auth.user?.preference?.$setAttribute('darkMode', data.darkMode);
    auth.user?.preference?.$setAttribute('notificationsOn', data.notificationsOn);

    await auth.user?.preference?.save();

    return auth.user?.preference;
  }
}
