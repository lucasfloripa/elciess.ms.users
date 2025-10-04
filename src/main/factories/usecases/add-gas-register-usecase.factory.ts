import { AddGasRegisterUsecase } from '@/application/usecases'
import { GasMongodb } from '@/infra/mongo'
import { WinstonLogger } from '@/infra/winstom'

export const makeAddGasRegisterUsecase = (): AddGasRegisterUsecase => {
  const logger = new WinstonLogger()
  const gasMongodb = new GasMongodb()
  const usecase = new AddGasRegisterUsecase(gasMongodb, logger)
  return usecase
}
