import { GetUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeGetUserUsecase = (): GetUserUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new GetUserUsecase(userMongodb)
  return usecase
}
