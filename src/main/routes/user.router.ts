import { Router, type Request, type Response } from 'express'

import {
  makeGetUserController,
  makeCreateUserController,
  makeAuthUserController,
  makeRefreshTokenController,
  makeUpdateUserController,
  makeDeleteUserController,
  makeGetUsersController,
  makeLogoutController,
  makeUpdateUserPasswordController
} from '../factories/controllers'

const userRouter = Router()

userRouter.get('/', async (req: Request, res: Response) => {
  const getUsersController = makeGetUsersController()
  const response = await getUsersController.handle({})
  res.send(response)
})

userRouter.get('/:id', async (req: Request, res: Response) => {
  const userId = req.params.id
  const getUserController = makeGetUserController()
  const response = await getUserController.handle({ userId })
  res.send(response)
})

userRouter.delete('/:id', async (req: Request, res: Response) => {
  const userId = req.params.id
  const deleteUserController = makeDeleteUserController()
  const response = await deleteUserController.handle(userId)
  res.send(response)
})

userRouter.put('/change-password', async (req: Request, res: Response) => {
  const updateUserPasswordController = makeUpdateUserPasswordController()
  const response = await updateUserPasswordController.handle(req.body)
  res.send(response)
})

userRouter.put('/:id', async (req: Request, res: Response) => {
  const userId = req.params.id
  const updateUserController = makeUpdateUserController()
  const response = await updateUserController.handle({ userId, ...req.body })
  res.send(response)
})

userRouter.post('/', async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController()
  const response = await createUserController.handle(req.body)
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

userRouter.post('/logout', async (req: Request, res: Response) => {
  const logoutController = makeLogoutController()
  const response = await logoutController.handle(req.body)
  res.send(response)
})

export { userRouter }
