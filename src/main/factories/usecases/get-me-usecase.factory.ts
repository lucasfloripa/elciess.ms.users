import { GetMeUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { RedisService } from '@/infra/redis'

export const makeGetMeUsecase = (): GetMeUsecase => {
  const userMongodb = new UserMongodb()
  const redisService = new RedisService()
  const usecase = new GetMeUsecase(userMongodb, redisService)
  return usecase
}
