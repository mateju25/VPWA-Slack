import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Message from 'App/Models/Message'
import UnreadChannel from 'App/Models/UnreadChannel'
import User from 'App/Models/User'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public private: boolean

  @hasMany(() => Message, {
    foreignKey: 'channel_id',
  })
  public messages: HasMany<typeof Message>

  @hasMany(() => UnreadChannel, {
    foreignKey: 'channel_id',
  })
  public unreadMessages: HasMany<typeof UnreadChannel>

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
    pivotColumns: ['role_id', 'joined', 'deleted', 'invited'],
  })
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
