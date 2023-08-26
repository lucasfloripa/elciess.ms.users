import { adaptRoute, adaptMiddleware } from '../../main/adapters'
import { makeAuthenticationController, makeCreateUserController, makeGetUserController } from '../../main/factories/controllers'
import { makeUserValidationMiddleware } from '../factories/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/create', adaptMiddleware(makeUserValidationMiddleware()), adaptRoute(makeCreateUserController()))
  router.get('/get/:id', adaptMiddleware(makeUserValidationMiddleware()), adaptRoute(makeGetUserController()))
  router.post('/auth', adaptRoute(makeAuthenticationController()))
}
