import { WinstonLogger } from '@/infra/winstom'
import { makeCreateUserUsecase } from '@/main/factories/usecases'
import { makeCreateUserValidator } from '@/main/factories/validators'
import { CreateUserController } from '@/presentation/controllers'
import { type IController } from '@/presentation/interfaces'

export const makeCreateUserController = (): IController => {
  const logger = new WinstonLogger()
  const usecase = makeCreateUserUsecase()
  const validator = makeCreateUserValidator()
  const controller: CreateUserController = new CreateUserController(
    usecase,
    validator,
    logger
  )
  return controller
}
