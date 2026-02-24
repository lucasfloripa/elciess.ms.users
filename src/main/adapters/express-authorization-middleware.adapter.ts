import { type NextFunction, type Request, type Response } from 'express'

import { type IMiddleware } from '@/presentation/interfaces'

export const adaptExpressAuthorizationMiddleware = (
  middleware: IMiddleware,
  action: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const middlewareRequest = {
      userId: req.user?.userId,
      role: req.user?.role,
      action,
      resource: {
        ...req.body,
        ...req.params,
        ...req.query
      }
    }

    const middlewareResponse = await middleware.handle(middlewareRequest)

    if (middlewareResponse.statusCode === 200) {
      next()
    } else {
      res.status(middlewareResponse.statusCode).json(middlewareResponse.body)
    }
  }
}
