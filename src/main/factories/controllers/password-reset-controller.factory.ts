import { makePasswordResetUsecase } from '@/main/factories/usecases'
import { makePasswordResetValidator } from '@/main/factories/validators'
import { PasswordResetController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makePasswordResetController = (): IController => {
  const usecase = makePasswordResetUsecase()
  const validator = makePasswordResetValidator()
  const controller: PasswordResetController = new PasswordResetController(
    usecase,
    validator
  )
  return controller
}
