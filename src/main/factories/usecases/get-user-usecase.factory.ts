import { GetUserUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'

export const makeGetUserUsecase = (): GetUserUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new GetUserUsecase(userMongodb)
  return usecase
}
