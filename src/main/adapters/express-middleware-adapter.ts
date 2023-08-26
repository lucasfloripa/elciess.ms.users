import { Middleware } from '../../presentation/protocols'

import { Request, Response, NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      token: req.headers?.authorization?.split(' ')[1],
      ...(req.headers || {})
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      console.log(httpResponse)
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
