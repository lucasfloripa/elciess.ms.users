import config from 'config'

import { MongoHelper } from '@/infra/mongo'
import { RabbitMQHelper } from '@/infra/rabbitmq'
import { RedisHelper } from '@/infra/redis'
import {
  type DbConfig,
  type RabbitMqConfig,
  type RedisConfig
} from '@/main/interfaces'

export async function initializeInfrastructure(): Promise<void> {
  const { mongoUri, mongodbName } = config.get<DbConfig>('dbConfig')
  const { rabbitMqUri } = config.get<RabbitMqConfig>('rabbitMqConfig')
  const { redisPort, redisHost } = config.get<RedisConfig>('redisConfig')

  try {
    await MongoHelper.getInstance().connect(mongoUri, mongodbName)
    console.log(`Mongo running on ${mongoUri}`)

    await RabbitMQHelper.getInstance().connect(rabbitMqUri)
    console.log(`RabbitMQ running on ${rabbitMqUri}`)

    RedisHelper.getInstance()
    console.log(`Redis running on port ${redisPort} host ${redisHost}`)
  } catch (error) {
    console.error('Failed to connect to infrastructure services:', error)
    throw error
  }
}

export async function disconnectInfrastructure(): Promise<void> {
  try {
    await MongoHelper.getInstance().disconnect()
    await RabbitMQHelper.getInstance().disconnect()
    await RedisHelper.getInstance().disconnect()
    console.log('All infrastructure services disconnected.')
  } catch (error) {
    console.error('Error during infrastructure shutdown:', error)
  }
}
