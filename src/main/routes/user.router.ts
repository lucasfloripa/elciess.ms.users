import { Router, type Request, type Response } from 'express'

import {
  makeGetUserController,
  makeCreateUserController,
  makeAuthUserController,
  makeRefreshTokenController,
  makeUpdateUserController
} from '../factories/controllers'

const userRouter = Router()

userRouter.get('/:id', async (req: Request, res: Response) => {
  const userId = req.params.id
  const getUserController = makeGetUserController()
  const response = await getUserController.handle({ userId })
  res.send(response)
})

userRouter.post('/create', async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController()
  const response = await createUserController.handle(req.body)
  res.send(response)
})

userRouter.post('/update', async (req: Request, res: Response) => {
  const updateeUserController = makeUpdateUserController()
  const response = await updateeUserController.handle(req.body)
  res.send(response)
})

userRouter.post('/auth', async (req: Request, res: Response) => {
  const authUserController = makeAuthUserController()
  const response = await authUserController.handle(req.body)
  res.send(response)
})

userRouter.post('/auth/refresh', async (req: Request, res: Response) => {
  const refreshTokenController = makeRefreshTokenController()
  const response = await refreshTokenController.handle(req.body)
  res.send(response)
})

export { userRouter }
