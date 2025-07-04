import { DeleteUserUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'

export const makeDeleteUserUsecase = (): DeleteUserUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new DeleteUserUsecase(userMongodb)
  return usecase
}
