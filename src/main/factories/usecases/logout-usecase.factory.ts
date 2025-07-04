import { LogoutUsecase } from '@/application/usecases'
import { UserMongodb } from '@/infra/mongo'

export const makeLogoutUsecase = (): LogoutUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new LogoutUsecase(userMongodb)
  return usecase
}
