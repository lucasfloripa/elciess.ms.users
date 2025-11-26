import { LogoutUsecase } from '@/application/usecases'
import { WinstonLogger } from '@/infra/winstom'

export const makeLogoutUsecase = (): LogoutUsecase => {
  const logger = new WinstonLogger()
  const usecase = new LogoutUsecase(logger)
  return usecase
}
