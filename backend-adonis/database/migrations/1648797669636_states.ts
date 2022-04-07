import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Prefences extends BaseSchema {
  protected tableName = 'preferences';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('state_name').notNullable().defaultTo('Offline');
      table.boolean('dark_mode').notNullable().defaultTo(true);
      table.boolean('notifications_on').notNullable().defaultTo(true);

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
