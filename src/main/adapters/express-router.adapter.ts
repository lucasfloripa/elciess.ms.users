import { type Request, type Response } from 'express'

import { type IHttpResponse, type IController } from '@/presentation/interfaces'

export const adaptExpressRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    console.log('@@@', req.cookies.refreshToken)
    const request = {
      ...req.user,
      ...req.body,
      ...req.params,
      ...req.query
    }
    const httpResponse = await controller.handle(request)

    if (_hasRefreshToken(httpResponse)) {
      const refreshToken = httpResponse.body.refreshToken

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000
      })

      delete httpResponse.body.refreshToken
    }

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}

const _hasRefreshToken = (httpResponse: IHttpResponse): boolean => {
  return (
    httpResponse?.body &&
    typeof httpResponse.body === 'object' &&
    httpResponse.body.refreshToken
  )
}
