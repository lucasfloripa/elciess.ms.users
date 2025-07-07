import { Router } from 'express'

import { UserRoles } from '@/domain/enums'
import { adaptExpressRoute, adaptExpressMiddlware } from '@/main/adapters'

import {
  makeGetUsersController,
  makeGetUserController,
  makeCreateUserController,
  makeUpdateUserPasswordController,
  makeDeleteUserController,
  makeGetMeController,
  makePasswordResetController
} from '../factories/controllers'
import {
  makeAuthTokenMiddleware,
  makeAuthRoleMiddleware
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
  '/me',
  adaptExpressMiddlware(makeAuthTokenMiddleware()),
  adaptExpressRoute(makeGetMeController())
)

userRouter.get(
  '/:id',
  adaptExpressMiddlware(makeAuthTokenMiddleware()),
  adaptExpressMiddlware(makeAuthRoleMiddleware(UserRoles.ADMIN)),
  adaptExpressRoute(makeGetUserController())
)

userRouter.get(
  '/',
  adaptExpressMiddlware(makeAuthTokenMiddleware()),
  adaptExpressMiddlware(makeAuthRoleMiddleware(UserRoles.ADMIN)),
  adaptExpressRoute(makeGetUsersController())
)

userRouter.delete(
  '/:id',
  adaptExpressMiddlware(makeAuthTokenMiddleware()),
  adaptExpressMiddlware(makeAuthRoleMiddleware(UserRoles.ADMIN)),
  adaptExpressRoute(makeDeleteUserController())
)
