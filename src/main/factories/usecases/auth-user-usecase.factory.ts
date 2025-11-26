import { AuthUserUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'
import { UserMongodb } from '@/infra/mongo'
import { RedisService } from '@/infra/redis'
import { WinstonLogger } from '@/infra/winstom'

export const makeAuthUserUsecase = (): AuthUserUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const jwtService = new JwtService()
  const redisService = new RedisService()
  const usecase = new AuthUserUsecase(
    userMongodb,
    jwtService,
    redisService,
    logger
  )
  return usecase
}
