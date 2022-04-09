import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
import Preference from 'App/Models/Preference';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const uniqueKey = 'username';
    for (let i = 0; i < 5; i++) {
      await Preference.create({
        stateName: 'Offline',
        darkMode: true,
        notificationsOn: true,
      });
    }
    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'jesse@jones.com',
        username: 'jesse',
        fullname: 'Jesse Jones',
        preference_id: 1,
        password: 'password',
      },
      {
        email: 'john@jones.com',
        username: 'johns',
        fullname: 'John Jones',
        preference_id: 2,
        password: 'password',
      },
      {
        email: 'tina@jones.com',
        username: 'tinas',
        fullname: 'Tina Jones',
        preference_id: 3,
        password: 'password',
      },
      {
        email: 'clarence@jones.com',
        username: 'clarence',
        fullname: 'Clarence Jones',
        preference_id: 4,
        password: 'password',
      },
      {
        email: 'anne@jones.com',
        username: 'annes',
        fullname: 'Anne Jones',
        preference_id: 5,
        password: 'password',
      },
    ]);
  }
}
