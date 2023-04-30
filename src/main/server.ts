/* eslint-disable import/first */
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import { PostgresHelper } from '../infra/db/postgres'

async function run (): Promise<void> {
  await PostgresHelper.connect()
  const app = (await import('./config/app')).default
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${
        process.env.PORT
      }`)
  })
}

void run()
