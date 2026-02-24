import { Router } from 'express'

import {
  adaptExpressAuthenticationMiddleware,
  adaptExpressRoute,
  refreshTokenExtractor
} from '@/main/adapters'

import {
  makeLoginController,
  makeRefreshTokenController,
  makeLogoutController,
  makeGetMeController
} from '../factories/controllers'
import { makeAuthenticationMiddleware } from '../factories/middlewares'

export const authRouter = Router()

authRouter.post('/login', adaptExpressRoute(makeLoginController()))

authRouter.post('/logout', adaptExpressRoute(makeLogoutController()))

authRouter.get(
  '/refresh',
  refreshTokenExtractor(),
  adaptExpressRoute(makeRefreshTokenController())
)

authRouter.get(
  '/me',
  adaptExpressAuthenticationMiddleware(makeAuthenticationMiddleware()),
  adaptExpressRoute(makeGetMeController())
)
