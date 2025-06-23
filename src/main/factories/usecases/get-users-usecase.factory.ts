import { GetUsersUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeGetUsersUsecase = (): GetUsersUsecase => {
  const userMongodb = new UserMongodb()
  const getUsersUsecase = new GetUsersUsecase(userMongodb)
  return getUsersUsecase
}
