import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('email', 255).notNullable();
      table.string('username', 255).notNullable().unique();
      table.string('fullname', 255).notNullable();
      table.string('password', 180).notNullable();
      table.string('remember_me_token').nullable();
      table.boolean('logged').defaultTo(false);

      table
        .integer('preference_id')
        .unsigned()
        .references('id')
        .inTable('preferences')
        .onDelete('NO ACTION');

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
