import { AuthUserUsecase } from '@/application/usecases'
import { JwtService } from '@/infra/jwt'
import { UserMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeAuthUserUsecase = (): AuthUserUsecase => {
  const logger = new WinstonLogger()
  const userMongodb = new UserMongodb()
  const jwtService = new JwtService()
  const usecase = new AuthUserUsecase(userMongodb, jwtService, logger)
  return usecase
}
