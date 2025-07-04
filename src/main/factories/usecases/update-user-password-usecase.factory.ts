import { UpdateUserPasswordUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'

export const makeUpdateUserPasswordUsecase = (): UpdateUserPasswordUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new UpdateUserPasswordUsecase(userMongodb)
  return usecase
}
