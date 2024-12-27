import { CreateUserUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeCreateUserUsecase = (): CreateUserUsecase => {
  const userMongodb = new UserMongodb()
  const createUserUsecase = new CreateUserUsecase(userMongodb)
  return createUserUsecase
}
