import express from 'express'

import { setupMiddlewares } from '@/main/config/middlewares'
import { setupRoutes } from '@/main/config/router'

export function createApp(): express.Application {
  const app = express()
  setupMiddlewares(app)
  setupRoutes(app)
  return app
}
