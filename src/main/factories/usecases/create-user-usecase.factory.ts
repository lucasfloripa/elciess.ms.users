import { CreateUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeCreateUserUsecase = (): CreateUserUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new CreateUserUsecase(userMongodb)
  return usecase
}
