import { Router, type Request, type Response } from 'express'

import {
  makeCreateUserController,
  makeAuthUserController
} from '../factories/controllers'

const userRouter = Router()

userRouter.post('/create', async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController()
  const response = await createUserController.handle(req.body)
  res.send(response)
})

userRouter.post('/auth', async (req: Request, res: Response) => {
  const authUserController = makeAuthUserController()
  const response = await authUserController.handle(req.body)
  res.send(response)
})

export { userRouter }
