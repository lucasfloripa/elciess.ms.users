import { RefreshTokenUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'

export const makeRefreshTokenUsecase = (): RefreshTokenUsecase => {
  const jwtService = new JwtService()
  const usecase = new RefreshTokenUsecase(jwtService)
  return usecase
}
