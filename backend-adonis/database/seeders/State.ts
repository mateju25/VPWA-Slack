import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import State from 'App/Models/State';

export default class StateSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const uniqueKey = 'name';

    await State.updateOrCreateMany(uniqueKey, [
      {
        name: 'Online',
      },
      {
        name: 'Offline',
      },
      {
        name: 'DoNotDisturb',
      },
    ]);
  }
}
