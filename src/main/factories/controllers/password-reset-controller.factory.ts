import { PasswordResetController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makePasswordResetUsecase } from '../usecases'
import { makePasswordResetValidator } from '../validators'

export const makePasswordResetController = (): IController => {
  const usecase = makePasswordResetUsecase()
  const validator = makePasswordResetValidator()
  const controller: PasswordResetController = new PasswordResetController(
    usecase,
    validator
  )
  return controller
}
