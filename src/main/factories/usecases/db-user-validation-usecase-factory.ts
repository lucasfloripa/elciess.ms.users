import { DbUserValidationUsecase } from '../../../application/usecases/db-user-validation-usecase'
import { JwtAdapter } from '../../../infra/cryptography'
import { UserPostgresRepository } from '../../../infra/db/postgres'

export const makeDbUserValidationUsecase = (): DbUserValidationUsecase => {
  const jwtAdapter = new JwtAdapter()
  const userRepository = new UserPostgresRepository()
  return new DbUserValidationUsecase(jwtAdapter, userRepository)
}
