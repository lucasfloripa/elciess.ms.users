import { CreateUserUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeCreateUserUsecase = (): CreateUserUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const usecase = new CreateUserUsecase(userMongodb, logger)
  return usecase
}
