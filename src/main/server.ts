import 'dotenv/config'
import config from 'config'

import { MongoHelper } from '../infra/mongo'
import { log, logError } from '../utils/log'

import { createApp } from './app'
import { type DbConfig } from './interfaces'

async function main(): Promise<void> {
  const { appPort, mongoUri, mongodbName } = config.get<DbConfig>('dbConfig')
  try {
    await MongoHelper.getInstance().connect(mongoUri, mongodbName)
    const app = createApp()
    const server = app.listen(appPort, () => {
      log(`Server running on port ${appPort}`)
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
