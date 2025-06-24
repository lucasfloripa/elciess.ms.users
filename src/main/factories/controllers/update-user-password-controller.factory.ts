import { UpdateUserPasswordController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeUpdateUserPasswordUsecase } from '../usecases'
import { makeUpdateUserPasswordUserValidator } from '../validators'

export const makeUpdateUserPasswordController = (): IController => {
  const usecase = makeUpdateUserPasswordUsecase()
  const validator = makeUpdateUserPasswordUserValidator()
  const controller: UpdateUserPasswordController =
    new UpdateUserPasswordController(usecase, validator)
  return controller
}
