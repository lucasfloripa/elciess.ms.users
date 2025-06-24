import { DeleteUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeDeleteUserUsecase = (): DeleteUserUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new DeleteUserUsecase(userMongodb)
  return usecase
}
