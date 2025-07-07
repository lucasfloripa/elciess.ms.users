import { UpdateUserPasswordUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeUpdateUserPasswordUsecase = (): UpdateUserPasswordUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new UpdateUserPasswordUsecase(userMongodb, logger)
  return usecase
}
