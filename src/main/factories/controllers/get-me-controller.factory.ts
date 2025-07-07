import { WinstonLogger } from '@/infra/winstom'
import { makeGetMeUsecase } from '@/main/factories/usecases'
import { makeGetMeValidator } from '@/main/factories/validators'
import { GetMeController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeGetMeController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeGetMeUsecase()
  const validator = makeGetMeValidator()
  const controller: GetMeController = new GetMeController(
    usecase,
    validator,
    logger
  )
  return controller
}
