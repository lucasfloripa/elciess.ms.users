import { Router } from 'express'

import { adaptExpressRoute } from '@/main/adapters'

import {
  makeAuthUserController,
  makeRefreshTokenController,
  makeLogoutController
} from '../factories/controllers'

export const authRouter = Router()

authRouter.post('/auth', adaptExpressRoute(makeAuthUserController()))

authRouter.post(
  '/auth/refresh',
  adaptExpressRoute(makeRefreshTokenController())
)
authRouter.post('/logout', adaptExpressRoute(makeLogoutController()))
