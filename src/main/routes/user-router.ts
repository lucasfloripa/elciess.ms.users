import { adaptRoute } from '@src/main/adapters'
import { makeCreateUserController } from '@src/main/factories/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/create', adaptRoute(makeCreateUserController()))
}
