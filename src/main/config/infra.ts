import config from 'config'

import { MongoHelper } from '@/infra/mongo'
import { type DbConfig } from '@/main/interfaces'

export async function initializeInfrastructure(): Promise<void> {
  const { mongoUri, mongodbName } = config.get<DbConfig>('dbConfig')

  try {
    await MongoHelper.getInstance().connect(mongoUri, mongodbName)
    console.log(`Mongo running on ${mongoUri}`)
  } catch (error) {
    console.error('Failed to connect to infrastructure services:', error)
    throw error
  }
}

export async function disconnectInfrastructure(): Promise<void> {
  try {
    await MongoHelper.getInstance().disconnect()
    console.log('All infrastructure services disconnected.')
  } catch (error) {
    console.error('Error during infrastructure shutdown:', error)
  }
}
