import { WinstonLogger } from '@/infra/winstom'
import { makeAddGasRegisterUsecase } from '@/main/factories/usecases'
import { makeAddGasRegisterValidator } from '@/main/factories/validators'
import { AddGasRegisterController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeAddGasRegisterController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeAddGasRegisterUsecase()
  const validator = makeAddGasRegisterValidator()
  const controller: AddGasRegisterController = new AddGasRegisterController(
    usecase,
    validator,
    logger
  )
  return controller
}
