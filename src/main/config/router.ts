import { Router } from 'express'

import { authRouter, userRouter } from '@/main/routes'

import type express from 'express'

export function setupRoutes(app: express.Application): void {
  const apiRouter = Router()

  apiRouter.use('/users', userRouter)
  apiRouter.use('/auth', authRouter)

  app.use('/api', apiRouter)
}
