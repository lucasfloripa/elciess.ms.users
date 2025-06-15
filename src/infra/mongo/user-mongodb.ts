import { type Collection } from 'mongodb'

import { type IUserRepository } from '../../application/contracts'
import { type DbUser } from '../../domain/ports/outbounds'
import { log, logError } from '../../utils/log'

import { MongoHelper } from './mongo-helper'

export class UserMongodb implements IUserRepository {
  collectionName: string = 'users'
  private readonly mongoHelper: MongoHelper

  constructor() {
    this.mongoHelper = MongoHelper.getInstance()
  }

  private async _getCollection(): Promise<Collection> {
    return await this.mongoHelper.getCollection(this.collectionName)
  }

  async save(userToInsert: DbUser): Promise<void> {
    const userCollection = await this._getCollection()
    await userCollection
      .insertOne(userToInsert)
      .then(() => {
        log('UserMongodb.save succefull:', userToInsert)
      })
      .catch((err) => {
        logError('UserMongodb.save error:', err)
      })
  }

  async loadByEmail(email: string): Promise<DbUser | null> {
    const userCollection = await this._getCollection()
    const user = await userCollection
      .findOne<DbUser>({ email })
      .then((user) => {
        log('UserMongodb.loadByEmail succefull:', user)
        return user
      })
      .catch((err) => {
        logError('UserMongodb.loadByEmail error:', err)
        return null
      })
    return user
  }

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const userCollection = await this._getCollection()
    await userCollection.findOneAndUpdate(
      { userId },
      { $set: { refreshToken: token } },
      { upsert: false }
    )
  }
}
