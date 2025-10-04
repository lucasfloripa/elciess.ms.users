import { type Collection } from 'mongodb'

import { type IGasRepository } from '@/application/contracts'
import { type IGasRegister } from '@/domain/interfaces'

import { MongoHelper } from './mongo-helper'

export class GasMongodb implements IGasRepository {
  collectionName: string = 'gas'
  private readonly mongoHelper: MongoHelper

  constructor() {
    this.mongoHelper = MongoHelper.getInstance()
  }

  private async _getCollection(): Promise<Collection> {
    return await this.mongoHelper.getCollection(this.collectionName)
  }

  async addRegister(gasRegister: IGasRegister): Promise<void> {
    const gasCollection = await this._getCollection()
    await gasCollection.insertOne(gasRegister)
  }
}
