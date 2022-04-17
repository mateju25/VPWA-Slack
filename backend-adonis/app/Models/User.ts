import { DateTime } from 'luxon';
import {
  BaseModel,
  beforeSave,
  column,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Preference from 'App/Models/Preference';
import Message from 'App/Models/Message';
import UnreadChannel from 'App/Models/UnreadChannel';
import Channel from 'App/Models/Channel';
import Hash from '@ioc:Adonis/Core/Hash';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column()
  public username: string;

  @column()
  public fullname: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken?: string;

  @column()
  public preference_id: number;

  @hasOne(() => Preference, {
    localKey: 'preference_id',
    foreignKey: 'id',
  })
  public preference: HasOne<typeof Preference>;

  @hasMany(() => Message, {
    foreignKey: 'written_by',
  })
  public messages: HasMany<typeof Message>;

  @hasMany(() => UnreadChannel, {
    foreignKey: 'user_id',
  })
  public unreadMessages: HasMany<typeof UnreadChannel>;

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
    pivotColumns: ['role_id', 'joined', 'kickedBy', 'kickedAt', 'invited'],
    onQuery(query) {
      query.preload('owners');
      query.preload('members');
      query.whereNullPivot('kickedAt');
    },
  })
  public channels: ManyToMany<typeof Channel>;

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
    pivotColumns: ['role_id', 'joined', 'kickedBy', 'kickedAt', 'invited'],
    onQuery(query) {
      query.preload('owners');
      query.preload('members');
      query.whereNotNullPivot('kickedAt');
    },
  })
  public kickedChannels: ManyToMany<typeof Channel>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
