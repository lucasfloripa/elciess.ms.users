import { type NextFunction, type Request, type Response } from 'express'

export const refreshTokenExtractor = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.refreshToken = req.cookies.refreshToken
    next()
  }
}
