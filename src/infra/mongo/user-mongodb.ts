import { type Collection } from 'mongodb'

import { type IUserRepository } from '../../application/contracts'
import { type IUser } from '../../domain/interfaces/user.interfaces'
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

  async getUser(filter: Partial<IUser>): Promise<IUser | null> {
    const userCollection = await this._getCollection()
    const user = await userCollection.findOne<IUser>(filter)
    log('UserMongodb.getUser success:', user)
    return user
  }

  async save(userToInsert: IUser): Promise<void> {
    const userCollection = await this._getCollection()
    await userCollection
      .insertOne(userToInsert)
      .then(() => {
        log('UserMongodb.save success:', userToInsert)
      })
      .catch((err) => {
        logError('UserMongodb.save error:', err)
      })
  }

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const userCollection = await this._getCollection()
    await userCollection.findOneAndUpdate(
      { userId },
      { $set: { refreshToken: token } },
      { upsert: false }
    )
  }

  async checkRefreshToken(userId: string, token: string): Promise<boolean> {
    const userCollection = await this._getCollection()
    const user = await userCollection.findOne<IUser>({
      userId
    })
    return user?.refreshToken === token
  }
}
