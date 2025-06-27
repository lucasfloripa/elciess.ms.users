import 'dotenv/config'
import config from 'config'

import { MongoHelper } from '../infra/mongo'
import { RabbitMQHelper } from '../infra/rabbitmq'
import { log, logError } from '../utils/log'

import { createApp } from './app'
import {
  type DbConfig,
  type AppConfig,
  type RabbitMqConfig
} from './interfaces'

async function main(): Promise<void> {
  const { mongoUri, mongodbName } = config.get<DbConfig>('dbConfig')
  const { appPort } = config.get<AppConfig>('appConfig')
  const { rabbitMqUri } = config.get<RabbitMqConfig>('rabbitMqConfig')

  try {
    await MongoHelper.getInstance().connect(mongoUri, mongodbName)
    await RabbitMQHelper.getInstance().connect(rabbitMqUri)
    const app = createApp()
    const server = app.listen(appPort, () => {
      log(`Server running on port ${appPort}`)
      log(`Mongo running on ${mongoUri}`)
      log(`RabbitqMQ running on ${rabbitMqUri}`)
    })
    process.on('SIGINT', () => {
      server.close(() => {
        ;(async () => {
          await MongoHelper.getInstance().disconnect()
          process.exit(0)
        })().catch((err) => {
          console.error('Error on shutdown:', err)
          process.exit(1)
        })
      })
    })
  } catch (err) {
    logError('Failed to start server:', err)
    process.exit(1)
  }
}

void main()
