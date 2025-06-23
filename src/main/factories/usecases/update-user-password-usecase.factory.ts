import { UpdateUserPasswordUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeUpdateUserPasswordUsecase = (): UpdateUserPasswordUsecase => {
  const userMongodb = new UserMongodb()
  const updateUserUpdateUsecase = new UpdateUserPasswordUsecase(userMongodb)
  return updateUserUpdateUsecase
}
