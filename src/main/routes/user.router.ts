import { Router } from 'express'

import { UserRoles } from '../../domain/enums'
import { adaptExpressRoute, adaptExpressMiddlware } from '../adapters'
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
  '/:userId',
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
userRouter.put(
  '/:userId',
  adaptExpressMiddlware(makeAuthTokenMiddleware()),
  adaptExpressMiddlware(makeAuthRoleMiddleware(UserRoles.ADMIN)),
  adaptExpressRoute(makeUpdateUserController())
)

userRouter.delete(
  '/:userId',
  adaptExpressMiddlware(makeAuthTokenMiddleware()),
  adaptExpressMiddlware(makeAuthRoleMiddleware(UserRoles.ADMIN)),
  adaptExpressRoute(makeDeleteUserController())
)

export { userRouter }
