import { CreateUserController } from '../../../../src/presentation/controllers'
import { type IController } from '../../../../src/presentation/protocols'
import { makeCreateUserUsecase } from '../usecases'
import { makeCreateUserValidator } from '../validators'

export const makeCreateUserController = (): IController => {
  const usecase = makeCreateUserUsecase()
  const validator = makeCreateUserValidator()
  const createUserController: CreateUserController = new CreateUserController(
    usecase,
    validator
  )
  return createUserController
}
