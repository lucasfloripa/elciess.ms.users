import { adaptRoute } from '@src/main/adapters'
import { makeCreateUserController, makeGetUserController } from '@src/main/factories/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/create', adaptRoute(makeCreateUserController()))
  router.get('/get/:id', adaptRoute(makeGetUserController()))
}
