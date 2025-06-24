import { RefreshTokenController } from '../../../presentation/controllers'
import { type IController } from '../../../presentation/interfaces'
import { makeRefreshTokenUsecase } from '../usecases'
import { makeRefreshTokenValidator } from '../validators'

export const makeRefreshTokenController = (): IController => {
  const usecase = makeRefreshTokenUsecase()
  const validator = makeRefreshTokenValidator()
  const controller: RefreshTokenController = new RefreshTokenController(
    usecase,
    validator
  )
  return controller
}
