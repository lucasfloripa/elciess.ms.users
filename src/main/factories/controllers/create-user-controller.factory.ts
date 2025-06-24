import { CreateUserController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeCreateUserUsecase } from '../usecases'
import { makeCreateUserValidator } from '../validators'

export const makeCreateUserController = (): IController => {
  const usecase = makeCreateUserUsecase()
  const validator = makeCreateUserValidator()
  const controller: CreateUserController = new CreateUserController(
    usecase,
    validator
  )
  return controller
}
