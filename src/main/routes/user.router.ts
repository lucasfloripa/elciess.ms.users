import { Router } from 'express'

import { UserRoles } from '../../domain/enums'
import { adaptExpressRoute, adaptExpressMiddlware } from '../adapters'
import {
  makeGetUsersController,
  makeGetUserController,
  makeCreateUserController,
  makeAuthUserController,
  makeRefreshTokenController,
  makeUpdateUserPasswordController,
  makeDeleteUserController,
  makeLogoutController,
  makeGetMeController
} from '../factories/controllers'
import {
  makeAuthTokenMiddleware,
  makeAuthRoleMiddleware
} from '../factories/middlewares'

const userRouter = Router()

userRouter.post('/auth', adaptExpressRoute(makeAuthUserController()))

userRouter.post(
  '/auth/refresh',
  adaptExpressRoute(makeRefreshTokenController())
)
userRouter.post('/logout', adaptExpressRoute(makeLogoutController()))

userRouter.post('/', adaptExpressRoute(makeCreateUserController()))

userRouter.put(
  '/change-password',
  adaptExpressRoute(makeUpdateUserPasswordController())
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

export { userRouter }
