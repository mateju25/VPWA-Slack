import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
import State from 'App/Models/State';
import argon2 from 'argon2';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const uniqueKey = 'username';

    let states = await State.all();
    let offline = states.find((state) => state.id === 2) as State;

    let users = await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'jesse@jones.com',
        username: 'jesse',
        fullname: 'Jesse Jones',
        password: await argon2.hash('password'),
      },
      {
        email: 'john@jones.com',
        username: 'john',
        fullname: 'John Jones',
        password: await argon2.hash('password'),
      },
      {
        email: 'tina@jones.com',
        username: 'tina',
        fullname: 'Tina Jones',
        password: await argon2.hash('password'),
      },
      {
        email: 'clarence@jones.com',
        username: 'clarence',
        fullname: 'Clarence Jones',
        password: await argon2.hash('password'),
      },
      {
        email: 'anne@jones.com',
        username: 'anne',
        fullname: 'Anne Jones',
        password: await argon2.hash('password'),
      },
    ]);
    users.forEach((user) => {
      user.state_id = offline.id;
    });
    for (let user of users) {
      await user.save();
    }
  }
}
