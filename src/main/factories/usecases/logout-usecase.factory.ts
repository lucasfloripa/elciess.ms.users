import { LogoutUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeLogoutUsecase = (): LogoutUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new LogoutUsecase(userMongodb)
  return usecase
}
