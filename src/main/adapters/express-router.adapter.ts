import { type Request, type Response } from 'express'

import { type IController } from '../../presentation/interfaces'

export const adaptExpressRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.user ?? {}),
      ...(req.body || {}),
      ...(req.params || {}),
      ...(req.query || {})
    }
    const httpResponse = await controller.handle(request)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
