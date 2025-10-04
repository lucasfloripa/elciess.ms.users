import { Router } from 'express'

import { authRouter, gasRouter, userRouter } from '@/main/routes'

import type express from 'express'

export function setupRoutes(app: express.Application): void {
  const apiRouter = Router()

  apiRouter.use('/users', userRouter)
  apiRouter.use('/auth', authRouter)
  apiRouter.use('/gas', gasRouter)

  app.use('/api', apiRouter)
}
