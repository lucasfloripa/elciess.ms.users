import { Router } from 'express'

import { adaptExpressRoute, refreshTokenExtractor } from '@/main/adapters'

import {
  makeAuthUserController,
  makeRefreshTokenController,
  makeLogoutController
} from '../factories/controllers'

export const authRouter = Router()

authRouter.post('/login', adaptExpressRoute(makeAuthUserController()))

authRouter.post('/logout', adaptExpressRoute(makeLogoutController()))

authRouter.get(
  '/refresh',
  refreshTokenExtractor(),
  adaptExpressRoute(makeRefreshTokenController())
)
