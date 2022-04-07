import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';

export default class Preference extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public stateName: string;

  @column()
  public darkMode: boolean;

  @column()
  public notificationsOn: boolean;

  @belongsTo(() => User, {
    foreignKey: 'preference_id',
    localKey: 'id',
  })
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
