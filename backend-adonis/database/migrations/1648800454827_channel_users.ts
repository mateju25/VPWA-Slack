import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ChannelUsers extends BaseSchema {
  protected tableName = 'channel_users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE');

      table.json('kickedBy').defaultTo('[]');
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('joined');
      table.timestamp('invited');
      table.timestamp('kickedAt').defaultTo(null);
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
