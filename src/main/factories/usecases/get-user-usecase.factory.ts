import { GetUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeGetUserUsecase = (): GetUserUsecase => {
  const userMongodb = new UserMongodb()
  const getUserUsecase = new GetUserUsecase(userMongodb)
  return getUserUsecase
}
