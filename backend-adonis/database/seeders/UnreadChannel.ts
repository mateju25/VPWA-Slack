import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import UnreadChannel from 'App/Models/UnreadChannel';

export default class UnreadChannelSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await UnreadChannel.createMany([
      {
        user_id: 1,
        channel_id: 2,
      },
      {
        user_id: 1,
        channel_id: 6,
      },
    ]);
  }
}
