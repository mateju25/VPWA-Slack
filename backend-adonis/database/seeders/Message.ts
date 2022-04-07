import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Message from 'App/Models/Message';

export default class MessageSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Message.createMany([
      {
        text: 'Nieco pisem do chatu od prihlseneho usera',
        written_by: 1,
        channel_id: 1,
      },
      {
        text: 'Nieco pisem do chatu od ineho usera a oznacujem @jesse',
        written_by: 2,
        channel_id: 1,
      },
      {
        text: 'Nieco pisem do chatu od dalsieho usera',
        written_by: 3,
        channel_id: 1,
      },
      {
        text: 'Nieco pisem do chatu od dalsieho usera',
        written_by: 3,
        channel_id: 1,
      },
      {
        text: 'Nieco pisem do chatu, a clovek to este nevidel',
        written_by: 3,
        channel_id: 2,
      },
      {
        text: 'Nieco pisem do chatu, a clovek to este nevidel v private kanali',
        written_by: 5,
        channel_id: 6,
      },
    ]);
  }
}
