import { makeLogoutUsecase } from '@/main/factories/usecases'
import { makeLogoutValidator } from '@/main/factories/validators'
import { LogoutController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeLogoutController = (): IController => {
  const usecase = makeLogoutUsecase()
  const validator = makeLogoutValidator()
  const controller: LogoutController = new LogoutController(usecase, validator)
  return controller
}
