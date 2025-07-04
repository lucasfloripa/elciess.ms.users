import { makeGetUserUsecase } from '@/main/factories/usecases'
import { makeGetUserValidator } from '@/main/factories/validators'
import { GetUserController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeGetUserController = (): IController => {
  const usecase = makeGetUserUsecase()
  const validator = makeGetUserValidator()
  const controller: GetUserController = new GetUserController(
    usecase,
    validator
  )
  return controller
}
