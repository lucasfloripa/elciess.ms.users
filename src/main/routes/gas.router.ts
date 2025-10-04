import { Router } from 'express'

import { adaptExpressRoute } from '@/main/adapters'

import { makeAddGasRegisterController } from '../factories/controllers'

export const gasRouter = Router()

gasRouter.post('/', adaptExpressRoute(makeAddGasRegisterController()))
