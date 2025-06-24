import { LogoutController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeLogoutUsecase } from '../usecases'
import { makeLogoutValidator } from '../validators'

export const makeLogoutController = (): IController => {
  const usecase = makeLogoutUsecase()
  const validator = makeLogoutValidator()
  const controller: LogoutController = new LogoutController(usecase, validator)
  return controller
}
