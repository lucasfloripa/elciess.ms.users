import { DeleteUserUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeDeleteUserUsecase = (): DeleteUserUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new DeleteUserUsecase(userMongodb, logger)
  return usecase
}
