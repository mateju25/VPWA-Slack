import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
import argon2 from 'argon2';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const uniqueKey = 'username';

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'jesse@jones.com',
        username: 'jesse',
        fullname: 'Jesse Jones',
        state_id: 2,
        password: await argon2.hash('password'),
      },
      {
        email: 'john@jones.com',
        username: 'john',
        fullname: 'John Jones',
        state_id: 2,
        password: await argon2.hash('password'),
      },
      {
        email: 'tina@jones.com',
        username: 'tina',
        fullname: 'Tina Jones',
        state_id: 2,
        password: await argon2.hash('password'),
      },
      {
        email: 'clarence@jones.com',
        username: 'clarence',
        fullname: 'Clarence Jones',
        state_id: 2,
        password: await argon2.hash('password'),
      },
      {
        email: 'anne@jones.com',
        username: 'anne',
        fullname: 'Anne Jones',
        state_id: 2,
        password: await argon2.hash('password'),
      },
    ]);
  }
}
