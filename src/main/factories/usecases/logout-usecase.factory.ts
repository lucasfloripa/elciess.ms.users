import { LogoutUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeLogoutUsecase = (): LogoutUsecase => {
  const userMongodb = new UserMongodb()
  const logoutUsecase = new LogoutUsecase(userMongodb)
  return logoutUsecase
}
