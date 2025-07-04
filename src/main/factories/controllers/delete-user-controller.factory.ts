import { makeDeleteUserUsecase } from '@/main/factories/usecases'
import { makeDeleteUserValidator } from '@/main/factories/validators'
import { DeleteUserController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeDeleteUserController = (): IController => {
  const usecase = makeDeleteUserUsecase()
  const validator = makeDeleteUserValidator()
  const controller: DeleteUserController = new DeleteUserController(
    usecase,
    validator
  )
  return controller
}
