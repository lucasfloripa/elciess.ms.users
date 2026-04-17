import { PasswordResetUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makePasswordResetUsecase = (): PasswordResetUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new PasswordResetUsecase(userMongodb, logger)
  return usecase
}
