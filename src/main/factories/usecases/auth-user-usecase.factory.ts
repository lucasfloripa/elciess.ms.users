import { AuthUserUsecase } from '../../../application/usecases'
import { JwtService } from '../../../infra/jwt'
import { UserMongodb } from '../../../infra/mongo'

export const makeAuthUserUsecase = (): AuthUserUsecase => {
  const userMongodb = new UserMongodb()
  const jwtService = new JwtService()
  const usecase = new AuthUserUsecase(userMongodb, jwtService)
  return usecase
}
