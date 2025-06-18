import { UpdateUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeUpdateUserUsecase = (): UpdateUserUsecase => {
  const userMongodb = new UserMongodb()
  const updateUserUsecase = new UpdateUserUsecase(userMongodb)
  return updateUserUsecase
}
