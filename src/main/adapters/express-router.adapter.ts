import { type Request, type Response } from 'express'

import { type IHttpResponse, type IController } from '@/presentation/interfaces'

export const adaptExpressRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const authHeader = req.get('authorization')
    const accessToken = authHeader?.split(' ')[1]

    const request = {
      ...req.user,
      ...req.body,
      ...req.params,
      ...req.query,
      accessToken,
      refreshToken: req.refreshToken
    }

    const httpResponse = await controller.handle(request)

    _checkRefreshToken(httpResponse, res)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}

const _checkRefreshToken = (
  httpResponse: IHttpResponse,
  res: Response
): void => {
  if (
    httpResponse?.body &&
    typeof httpResponse.body === 'object' &&
    httpResponse.body.refreshTokenCookie
  ) {
    const { value, maxAge } = httpResponse.body.refreshTokenCookie

    res.cookie('refreshToken', value, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge
    })

    delete httpResponse.body.refreshTokenCookie
  }
}
