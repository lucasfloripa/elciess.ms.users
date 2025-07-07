import express from 'express'

import { setupRoutes } from '@/main/config/router'

export function createApp(): express.Application {
  const app = express()
  setupRoutes(app)
  return app
}
