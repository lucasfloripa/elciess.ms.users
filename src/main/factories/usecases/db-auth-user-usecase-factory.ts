import { DbAuthUserUsecase } from '../../../application/usecases/db-auth-user-usecase'
import { BcryptAdapter, JwtAdapter } from '../../../infra/cryptography'
import { UserPostgresRepository } from '../../../infra/db/postgres'

export const makeDbAuthUserRepository = (): DbAuthUserUsecase => {
  const salt = 12
  const hashComparer = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter()
  const userPostgresRepository = new UserPostgresRepository()
  return new DbAuthUserUsecase(userPostgresRepository, hashComparer, jwtAdapter)
}
