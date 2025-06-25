import { RefreshTokenUsecase } from '../../../../src/application/usecases'
import { JwtService } from '../../../../src/infra/jwt'

export const makeRefreshTokenUsecase = (): RefreshTokenUsecase => {
  const jwtService = new JwtService()
  const usecase = new RefreshTokenUsecase(jwtService)
  return usecase
}
