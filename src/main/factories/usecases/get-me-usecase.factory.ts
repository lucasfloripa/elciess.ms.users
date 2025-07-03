import { GetMeUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'
import { RedisService } from '../../../../src/infra/redis'

export const makeGetMeUsecase = (): GetMeUsecase => {
  const userMongodb = new UserMongodb()
  const redisService = new RedisService()
  const usecase = new GetMeUsecase(userMongodb, redisService)
  return usecase
}
