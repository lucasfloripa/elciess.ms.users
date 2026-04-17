import { GetMeUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeGetMeUsecase = (): GetMeUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new GetMeUsecase(userMongodb, logger)
  return usecase
}
