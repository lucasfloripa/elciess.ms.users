// src/main/server.ts (o arquivo que era seu main.ts)
import 'dotenv/config'
import config from 'config'

import { createApp } from '@/main/config/app'
import {
  initializeInfrastructure,
  disconnectInfrastructure
} from '@/main/config/infra'
import { type AppConfig } from '@/main/interfaces'

async function startServer(): Promise<void> {
  const { appPort } = config.get<AppConfig>('appConfig')
  console.log('App listening on port ' + appPort)
  try {
    await initializeInfrastructure()
    const app = createApp()
    const server = app.listen(appPort, () => {})

    process.on('SIGINT', () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      server.close(async () => {
        await disconnectInfrastructure()
        process.exit(0)
      })
    })
  } catch (err) {
    process.exit(1)
  }
}

void startServer()
