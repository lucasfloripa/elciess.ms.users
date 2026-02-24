import { AuthenticationUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'
import { WinstonLogger } from '@/infra/winstom'

export const makeAuthenticationUsecase = (): AuthenticationUsecase => {
  const logger = new WinstonLogger()
  const jwtService = new JwtService()
  const usecase = new AuthenticationUsecase(jwtService, logger)
  return usecase
}
