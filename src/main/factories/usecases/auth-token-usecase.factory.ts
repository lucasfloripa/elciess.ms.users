import { AuthTokenUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'
import { WinstonLogger } from '@/infra/winstom'

export const makeAuthTokenUsecase = (): AuthTokenUsecase => {
  const logger = new WinstonLogger()
  const jwtService = new JwtService()
  const usecase = new AuthTokenUsecase(jwtService, logger)
  return usecase
}
