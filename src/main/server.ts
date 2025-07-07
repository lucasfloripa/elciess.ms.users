// src/main/server.ts (o arquivo que era seu main.ts)
import 'dotenv/config'
import config from 'config'

import { createApp } from '@/main/config/app'
import {
  initializeInfrastructure,
  disconnectInfrastructure
} from '@/main/config/infra'
import { type AppConfig } from '@/main/interfaces'
import { log, logError } from '@/utils/log'

async function startServer(): Promise<void> {
  const { appPort } = config.get<AppConfig>('appConfig')

  try {
    await initializeInfrastructure()
    const app = createApp()
    const server = app.listen(appPort, () => {
      log(`Server running on port ${appPort}`)
    })

    process.on('SIGINT', () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      server.close(async () => {
        log('Server closed. Disconnecting infrastructure...')
        await disconnectInfrastructure()
        process.exit(0)
      })
    })
  } catch (err) {
    logError('Failed to start server due to infrastructure or app error:', err)
    process.exit(1)
  }
}

void startServer()
