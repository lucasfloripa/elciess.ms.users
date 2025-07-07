import { Router } from 'express'

import { adaptExpressRoute } from '@/main/adapters'

import {
  makeAuthUserController,
  makeRefreshTokenController,
  makeLogoutController
} from '../factories/controllers'

export const authRouter = Router()

authRouter.post('/login', adaptExpressRoute(makeAuthUserController()))

authRouter.post('/logout', adaptExpressRoute(makeLogoutController()))

authRouter.post('/refresh', adaptExpressRoute(makeRefreshTokenController()))
