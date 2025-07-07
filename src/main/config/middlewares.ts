import { json } from 'express'

import type express from 'express'

export function setupMiddlewares(app: express.Application): void {
  app.use(json())
}
