import { GetUsersUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeGetUsersUsecase = (): GetUsersUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new GetUsersUsecase(userMongodb, logger)
  return usecase
}
