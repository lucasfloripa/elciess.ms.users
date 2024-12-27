import { AuthUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeAuthUserUsecase = (): AuthUserUsecase => {
  const userMongodb = new UserMongodb()
  const authUserUsecase = new AuthUserUsecase(userMongodb)
  return authUserUsecase
}
