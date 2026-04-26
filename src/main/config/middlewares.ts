import cookieParser from 'cookie-parser'
import cors from 'cors'
import { json } from 'express'

import type express from 'express'

export function setupMiddlewares(app: express.Application): void {
  app.use(json())
  app.use(cookieParser())
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://strativy-flow-front.vercel.app',
        'https://strativyflow.com',
        'https://www.strativyflow.com'
      ],
      credentials: true
    })
  )
}
