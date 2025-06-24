import { AuthUserController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeAuthUserUsecase } from '../usecases'
import { makeAuthUserValidator } from '../validators'

export const makeAuthUserController = (): IController => {
  const usecase = makeAuthUserUsecase()
  const validator = makeAuthUserValidator()
  const controller: AuthUserController = new AuthUserController(
    usecase,
    validator
  )
  return controller
}
