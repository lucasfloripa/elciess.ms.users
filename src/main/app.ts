import express from 'express'

import { userRouter } from './routes'

export function createApp(): express.Application {
  const app = express()
  app.use(express.json())
  app.use('/api/users', userRouter)
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  })
  return app
}
