import { CreateUserUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { UserRabbitMq } from '@/infra/rabbitmq'
import { WinstonLogger } from '@/infra/winstom'

export const makeCreateUserUsecase = (): CreateUserUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const userRabbitMq = new UserRabbitMq()
  const usecase = new CreateUserUsecase(userMongodb, userRabbitMq, logger)
  return usecase
}
