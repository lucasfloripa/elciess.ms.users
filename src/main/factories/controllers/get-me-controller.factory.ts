import { GetMeController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeGetMeUsecase } from '../usecases'
import { makeGetMeValidator } from '../validators'

export const makeGetMeController = (): IController => {
  const usecase = makeGetMeUsecase()
  const validator = makeGetMeValidator()
  const controller: GetMeController = new GetMeController(usecase, validator)
  return controller
}
