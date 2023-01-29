import { CreateUserController } from '@src/presentation/controllers'
import { makeDbCreateUserRepository } from '@src/main/factories/usecases'
import { makeCreateUserControllerValidation } from '@src/main/factories/validations'

export const makeCreateUserController = (): CreateUserController => {
  const createUserApplication = makeDbCreateUserRepository()
  const createUserControllerValidation = makeCreateUserControllerValidation()
  return new CreateUserController(createUserApplication, createUserControllerValidation)
}
