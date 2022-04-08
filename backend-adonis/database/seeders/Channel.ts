import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
import Channel from 'App/Models/Channel';
import { DateTime } from 'luxon';

export default class ChannelSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    let users = await User.all();

    let channels = await Channel.createMany([
      {
        name: 'General',
        isPrivate: false,
      },
      {
        name: 'Studovna',
        isPrivate: false,
      },
      {
        name: 'Klietka',
        isPrivate: false,
      },
      {
        name: 'Opicarna',
        isPrivate: false,
      },
      {
        name: 'Medzi 4 ocami',
        isPrivate: true,
      },
      {
        name: 'Porada',
        isPrivate: true,
      },
      {
        name: 'Porada sefovia',
        isPrivate: true,
      },
    ]);
    for (let user of users) {
      await user.related('channels').attach({
        [channels[0].id]: {
          role_id: 2,
          joined: DateTime.now(),
          invited: DateTime.now(),
        },
      });
      await user.related('channels').attach({
        [channels[1].id]: {
          role_id: 2,
          joined: DateTime.now(),
          invited: DateTime.now(),
        },
      });
      if (user.id < 3) {
        await user.related('channels').attach({
          [channels[2].id]: {
            role_id: 2,
            joined: DateTime.now(),
            invited: DateTime.now(),
          },
        });
        await user.related('channels').attach({
          [channels[3].id]: {
            role_id: 2,
            joined: DateTime.now(),
            invited: DateTime.now(),
          },
        });
      }
    }
    await users[0].related('channels').attach({
      [channels[4].id]: {
        role_id: 1,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await users[1].related('channels').attach({
      [channels[4].id]: {
        role_id: 2,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await users[0].related('channels').attach({
      [channels[5].id]: {
        role_id: 1,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await users[2].related('channels').attach({
      [channels[5].id]: {
        role_id: 2,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await users[4].related('channels').attach({
      [channels[5].id]: {
        role_id: 2,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await users[0].related('channels').attach({
      [channels[6].id]: {
        role_id: 2,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
    await users[1].related('channels').attach({
      [channels[6].id]: {
        role_id: 1,
        joined: DateTime.now(),
        invited: DateTime.now(),
      },
    });
  }
}
