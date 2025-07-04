import { AuthTokenUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'

export const makeAuthTokenUsecase = (): AuthTokenUsecase => {
  const jwtService = new JwtService()
  const usecase = new AuthTokenUsecase(jwtService)
  return usecase
}
