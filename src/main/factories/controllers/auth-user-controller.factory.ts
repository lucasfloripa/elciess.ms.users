import { AuthUserController } from '../../../../src/presentation/controllers'
import { type IController } from '../../../../src/presentation/protocols'
import { makeAuthUserUsecase } from '../usecases'
import { makeAuthUserValidator } from '../validators'

export const makeAuthUserController = (): IController => {
  const usecase = makeAuthUserUsecase()
  const validator = makeAuthUserValidator()
  const authUserController: AuthUserController = new AuthUserController(
    usecase,
    validator
  )
  return authUserController
}
