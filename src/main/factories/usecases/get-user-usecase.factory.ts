import { GetUserUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeGetUserUsecase = (): GetUserUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new GetUserUsecase(userMongodb, logger)
  return usecase
}
