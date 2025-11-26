import { RefreshTokenUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'
import { RedisService } from '@/infra/redis'
import { WinstonLogger } from '@/infra/winstom'

export const makeRefreshTokenUsecase = (): RefreshTokenUsecase => {
  const logger = new WinstonLogger()
  const jwtService = new JwtService()
  const redisService = new RedisService()
  const usecase = new RefreshTokenUsecase(jwtService, redisService, logger)
  return usecase
}
