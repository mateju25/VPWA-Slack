import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import State from 'App/Models/State'
import Message from 'App/Models/Message'
import UnreadChannel from 'App/Models/UnreadChannel'
import Channel from 'App/Models/Channel'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public fullname: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @belongsTo(() => State, {
    foreignKey: 'state_id',
  })
  public state: BelongsTo<typeof State>

  @hasMany(() => Message, {
    foreignKey: 'written_by',
  })
  public messages: HasMany<typeof Message>

  @hasMany(() => UnreadChannel, {
    foreignKey: 'user_id',
  })
  public unreadMessages: HasMany<typeof UnreadChannel>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
    pivotColumns: ['role_id', 'joined', 'deleted', 'invited'],
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        //TODO: treba sa spytat edka ako vytiahnut subselectom rolu
        //   query.preload('role_id');
      }
    },
  })
  public channels: ManyToMany<typeof Channel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
