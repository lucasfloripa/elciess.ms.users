import { LogoutUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeLogoutUsecase = (): LogoutUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new LogoutUsecase(userMongodb, logger)
  return usecase
}
