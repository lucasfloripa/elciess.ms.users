import { type NextFunction, type Request, type Response } from 'express'

import { type IMiddleware } from '@/presentation/interfaces'

export const adaptExpressAuthenticationMiddleware = (
  middleware: IMiddleware
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('authorization')
    const accessToken = authHeader?.split(' ')[1]

    const middlewareRequest = {
      accessToken
    }

    const middlewareResponse = await middleware.handle(middlewareRequest)

    if (middlewareResponse.statusCode === 200) {
      Object.assign(req, { user: middlewareResponse.body })
      next()
    } else {
      res.status(middlewareResponse.statusCode).json(middlewareResponse.body)
    }
  }
}
