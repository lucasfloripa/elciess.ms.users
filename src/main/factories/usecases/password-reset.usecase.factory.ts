import { PasswordResetUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { UserRabbitMq } from '@/infra/rabbitmq'
import { WinstonLogger } from '@/infra/winstom'

export const makePasswordResetUsecase = (): PasswordResetUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const userRabbitMq = new UserRabbitMq()
  const usecase = new PasswordResetUsecase(userMongodb, userRabbitMq, logger)
  return usecase
}
