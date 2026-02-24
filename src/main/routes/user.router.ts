import { Router } from 'express'

import {
  adaptExpressRoute,
  adaptExpressAuthenticationMiddleware,
  adaptExpressAuthorizationMiddleware
} from '@/main/adapters'

import {
  makeGetUsersController,
  makeGetUserController,
  makeCreateUserController,
  makeUpdateUserPasswordController,
  makeDeleteUserController,
  makePasswordResetController
} from '../factories/controllers'
import {
  makeAuthenticationMiddleware,
  makeAuthorizationMiddleware
} from '../factories/middlewares'

export const userRouter = Router()

userRouter.post('/', adaptExpressRoute(makeCreateUserController()))

userRouter.put(
  '/change-password',
  adaptExpressRoute(makeUpdateUserPasswordController())
)

userRouter.post(
  '/password-reset',
  adaptExpressRoute(makePasswordResetController())
)

userRouter.get(
  '/:id',
  adaptExpressAuthenticationMiddleware(makeAuthenticationMiddleware()),
  adaptExpressRoute(makeGetUserController())
)

userRouter.get(
  '/',
  adaptExpressAuthenticationMiddleware(makeAuthenticationMiddleware()),
  adaptExpressAuthorizationMiddleware(
    makeAuthorizationMiddleware(),
    'GET_USER'
  ),
  adaptExpressRoute(makeGetUsersController())
)

userRouter.delete(
  '/:id',
  adaptExpressAuthenticationMiddleware(makeAuthenticationMiddleware()),
  adaptExpressRoute(makeDeleteUserController())
)
