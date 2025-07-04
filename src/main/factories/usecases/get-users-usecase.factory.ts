import { GetUsersUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'

export const makeGetUsersUsecase = (): GetUsersUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new GetUsersUsecase(userMongodb)
  return usecase
}
