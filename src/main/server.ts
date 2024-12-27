import 'dotenv/config'
import config from 'config'
import express from 'express'

import { MongoHelper } from '../infra/mongo'
import { log, logError } from '../utils/log'

import { userRouter } from './routes'

interface DbConfig {
  mongoUri: string
  mongodbName: string
}

const dbConfig = config.get<DbConfig>('db')

async function main(): Promise<void> {
  const mongoHelper = MongoHelper.getInstance()
  await mongoHelper
    .connect(dbConfig.mongoUri, dbConfig.mongodbName)
    .then(() => {
      const app = express()
      const PORT = process.env.APP_PORT
      app.use(express.json())
      app.use('/api/users', userRouter)
      app.listen(PORT, () => {
        log(`Server is running on http://localhost:${PORT}`)
      })
    })
    .catch((err) => {
      logError('Failed to connect to MongoDB', err)
    })
}

void main()
