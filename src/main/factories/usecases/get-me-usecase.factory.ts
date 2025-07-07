import { GetMeUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { RedisService } from '@/infra/redis'
import { WinstonLogger } from '@/infra/winstom'

export const makeGetMeUsecase = (): GetMeUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const redisService = new RedisService()
  const usecase = new GetMeUsecase(userMongodb, redisService, logger)
  return usecase
}
