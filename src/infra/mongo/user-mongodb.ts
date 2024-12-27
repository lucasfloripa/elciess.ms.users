import { type Collection } from 'mongodb'

import { type IUserRepository } from '../../../src/application/contracts'
import { type User } from '../../../src/domain/entities'
import { log, logError } from '../../utils/log'

import { MongoHelper } from './mongo-helper'

export class UserMongodb implements IUserRepository {
  collectionName: string = 'users'
  private readonly mongoHelper: MongoHelper

  constructor() {
    this.mongoHelper = MongoHelper.getInstance()
  }

  private async getCollection(): Promise<Collection> {
    return await this.mongoHelper.getCollection(this.collectionName)
  }

  async save(user: User): Promise<void> {
    const userCollection = await this.getCollection()
    const userToInsert = { ...user }
    await userCollection
      .insertOne(userToInsert)
      .then(() => {
        log('UserMongodb.save succefull:', user)
      })
      .catch((err) => {
        logError('UserMongodb.save error:', err)
      })
  }

  async loadByEmail(email: string): Promise<User | null> {
    const userCollection = await this.getCollection()
    const user = await userCollection
      .findOne({ email })
      .then((user) => {
        log('UserMongodb.loadByEmail succefull:', user)
        return user
      })
      .catch((err) => {
        logError('UserMongodb.loadByEmail error:', err)
        return null
      })
    return user as unknown as User
  }
}
