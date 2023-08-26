import { UserValidationMiddleware } from '../../../presentation/middlewares'
import { makeDbUserValidationUsecase } from '../usecases'

export const makeUserValidationMiddleware = (): UserValidationMiddleware => {
  const dbUserValidationUsecase = makeDbUserValidationUsecase()
  return new UserValidationMiddleware(dbUserValidationUsecase)
}
