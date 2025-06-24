import { DeleteUserController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeDeleteUserUsecase } from '../usecases'
import { makeDeleteUserValidator } from '../validators'

export const makeDeleteUserController = (): IController => {
  const usecase = makeDeleteUserUsecase()
  const validator = makeDeleteUserValidator()
  const controller: DeleteUserController = new DeleteUserController(
    usecase,
    validator
  )
  return controller
}
