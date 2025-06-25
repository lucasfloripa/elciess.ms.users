import { AuthTokenUsecase } from '../../../../src/application/usecases'
import { JwtService } from '../../../../src/infra/jwt'

export const makeAuthTokenUsecase = (): AuthTokenUsecase => {
  const jwtService = new JwtService()
  const usecase = new AuthTokenUsecase(jwtService)
  return usecase
}
