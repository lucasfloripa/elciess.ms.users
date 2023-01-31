import { CreateUserController } from '../../../presentation/controllers'
import { makeDbCreateUserRepository } from '../../../main/factories/usecases'
import { makeCreateUserControllerValidation } from '../../../main/factories/validations'

export const makeCreateUserController = (): CreateUserController => {
  const createUserApplication = makeDbCreateUserRepository()
  const createUserControllerValidation = makeCreateUserControllerValidation()
  return new CreateUserController(createUserApplication, createUserControllerValidation)
}
