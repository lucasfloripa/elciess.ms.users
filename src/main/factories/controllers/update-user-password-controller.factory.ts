import { makeUpdateUserPasswordUsecase } from '@/main/factories/usecases'
import { makeUpdateUserPasswordUserValidator } from '@/main/factories/validators'
import { UpdateUserPasswordController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeUpdateUserPasswordController = (): IController => {
  const usecase = makeUpdateUserPasswordUsecase()
  const validator = makeUpdateUserPasswordUserValidator()
  const controller: UpdateUserPasswordController =
    new UpdateUserPasswordController(usecase, validator)
  return controller
}
