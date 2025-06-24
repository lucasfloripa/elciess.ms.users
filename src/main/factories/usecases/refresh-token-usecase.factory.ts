import { RefreshTokenUsecase } from '../../../../src/application/usecases'
import { JwtService } from '../../../../src/infra/jwt'
import { UserMongodb } from '../../../../src/infra/mongo'

export const makeRefreshTokenUsecase = (): RefreshTokenUsecase => {
  const userMongodb = new UserMongodb()
  const jwtService = new JwtService()
  const usecase = new RefreshTokenUsecase(userMongodb, jwtService)
  return usecase
}
