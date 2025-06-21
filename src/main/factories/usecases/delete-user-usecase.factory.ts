import { DeleteUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeDeleteUserUsecase = (): DeleteUserUsecase => {
  const userMongodb = new UserMongodb()
  const deleteUserUsecase = new DeleteUserUsecase(userMongodb)
  return deleteUserUsecase
}
