import 'dotenv/config'
import config from 'config'

import { createApp } from '@/main/config/app'
import {
  initializeInfrastructure,
  disconnectInfrastructure
} from '@/main/config/infra'
import { type AppConfig } from '@/main/interfaces'

async function startServer(): Promise<void> {
  try {
    const { appPort } = config.get<AppConfig>('appConfig')
    await initializeInfrastructure()
    const app = createApp()
    const server = app.listen(appPort, () => {
      console.log('App listening on port ' + appPort)
    })

    process.on('SIGINT', () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      server.close(async () => {
        await disconnectInfrastructure()
        process.exit(0)
      })
    })
  } catch (err) {
    console.error('Error ao startar o servidor', err)
    process.exit(1)
  }
}

void startServer()
