import { PasswordResetUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'
import { UserRabbitMq } from '@/infra/rabbitmq'

export const makePasswordResetUsecase = (): PasswordResetUsecase => {
  const userMongodb = new UserMongodb()
  const userRabbitMq = new UserRabbitMq()
  const usecase = new PasswordResetUsecase(userMongodb, userRabbitMq)
  return usecase
}
