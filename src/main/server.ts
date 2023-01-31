/* eslint-disable import/first */
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import { PostgresHelper } from '../../src/infra/db/postgres'

PostgresHelper.connect()
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${
      process.env.PORT
    }`)
    })
  })
  .catch(err => { console.log(err) })
