import { RefreshTokenUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'
import { WinstonLogger } from '@/infra/winstom'

export const makeRefreshTokenUsecase = (): RefreshTokenUsecase => {
  const logger = new WinstonLogger()
  const jwtService = new JwtService()
  const usecase = new RefreshTokenUsecase(jwtService, logger)
  return usecase
}
