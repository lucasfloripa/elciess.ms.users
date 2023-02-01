/* eslint-disable import/first */
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import { PostgresHelper } from '../infra/db/postgres'
import { KafkaHelper } from '../infra/message-brokers/kafka'

async function run (): Promise<void> {
  await PostgresHelper.connect()
  await KafkaHelper.producerConnect()
  const app = (await import('./config/app')).default
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${
        process.env.PORT
      }`)
  })
}

void run()
