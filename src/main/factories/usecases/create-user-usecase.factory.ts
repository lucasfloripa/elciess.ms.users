import { CreateUserUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'

export const makeCreateUserUsecase = (): CreateUserUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new CreateUserUsecase(userMongodb)
  return usecase
}
