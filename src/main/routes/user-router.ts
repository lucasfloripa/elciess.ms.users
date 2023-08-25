import { adaptRoute } from '../../main/adapters'
import { makeAuthenticationController, makeCreateUserController, makeGetUserController } from '../../main/factories/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/create', adaptRoute(makeCreateUserController()))
  router.get('/get/:id', adaptRoute(makeGetUserController()))
  router.post('/auth', adaptRoute(makeAuthenticationController()))
}
