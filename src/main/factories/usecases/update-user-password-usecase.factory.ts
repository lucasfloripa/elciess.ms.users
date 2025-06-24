import { UpdateUserPasswordUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeUpdateUserPasswordUsecase = (): UpdateUserPasswordUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new UpdateUserPasswordUsecase(userMongodb)
  return usecase
}
