import { type Collection } from 'mongodb'

import { type IUserRepository } from '../../application/contracts'
import {
  type ISanitezedUser,
  type IUser
} from '../../domain/interfaces/user.interfaces'

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
    return user
  }

  async updateUser(
    userFields: Partial<ISanitezedUser>
  ): Promise<ISanitezedUser | null> {
    const userCollection = await this._getCollection()
    const { userId, ...updateFields } = userFields
    const updated = await userCollection.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { returnDocument: 'after' }
    )
    if (!updated) return null
    const { password, ...sanitized } = updated as unknown as IUser
    return sanitized as ISanitezedUser
  }

  async deleteUser(userId: string): Promise<boolean> {
    const userCollection = await this._getCollection()
    const deleteResult = await userCollection.deleteOne({ userId })
    return deleteResult.deletedCount === 1
  }

  async save(userToInsert: IUser): Promise<void> {
    const userCollection = await this._getCollection()
    await userCollection.insertOne(userToInsert)
  }

  async getUsers(): Promise<IUser[] | null> {
    const userCollection = await this._getCollection()
    return await userCollection.find<IUser>({}).toArray()
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
