import { UpdateUserController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeUpdateUserUsecase } from '../usecases'
import { makeUpdateUserValidator } from '../validators'

export const makeUpdateUserController = (): IController => {
  const usecase = makeUpdateUserUsecase()
  const validator = makeUpdateUserValidator()
  const updateUserController: UpdateUserController = new UpdateUserController(
    usecase,
    validator
  )
  return updateUserController
}
