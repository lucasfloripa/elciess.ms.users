import { GetMeUsecase } from '../../../../src/application/usecases'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeGetMeUsecase = (): GetMeUsecase => {
  const userMongodb = new UserMongodb()
  const usecase = new GetMeUsecase(userMongodb)
  return usecase
}
