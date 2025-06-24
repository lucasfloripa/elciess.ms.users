import { GetUsersUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeGetUsersUsecase = (): GetUsersUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new GetUsersUsecase(userMongodb)
  return usecase
}
