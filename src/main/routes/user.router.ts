import { Router } from 'express'

import { adaptExpressRoute } from '../adapters'
import {
  makeGetUsersController,
  makeGetUserController,
  makeCreateUserController,
  makeAuthUserController,
  makeRefreshTokenController,
  makeUpdateUserController,
  makeUpdateUserPasswordController,
  makeDeleteUserController,
  makeLogoutController
} from '../factories/controllers'

const userRouter = Router()

// Rotas públicas
userRouter.post('/auth', adaptExpressRoute(makeAuthUserController()))
userRouter.post(
  '/auth/refresh',
  adaptExpressRoute(makeRefreshTokenController())
)
userRouter.post('/logout', adaptExpressRoute(makeLogoutController()))
userRouter.post('/', adaptExpressRoute(makeCreateUserController()))

// Middleware de autenticação pode ir aqui:
// userRouter.use(authMiddleware)

// Rotas protegidas (exemplo: authMiddleware aplicado aqui)
userRouter.get('/', adaptExpressRoute(makeGetUsersController()))
userRouter.get('/:userId', adaptExpressRoute(makeGetUserController()))
userRouter.put('/:userId', adaptExpressRoute(makeUpdateUserController()))
userRouter.put(
  '/change-password',
  adaptExpressRoute(makeUpdateUserPasswordController())
)
userRouter.delete('/:userId', adaptExpressRoute(makeDeleteUserController()))

export { userRouter }
