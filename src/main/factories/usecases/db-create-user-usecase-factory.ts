import { DbCreateUserUseCase } from '../../../application/usecases'
import { BcryptAdapter } from '../../../infra/cryptography'
import { UserPostgresRepository } from '../../../infra/db/postgres'
import { UuidAdapter } from '../../../infra/generators'

export const makeDbCreateUserRepository = (): DbCreateUserUseCase => {
  const salt = 12
  const userPostgresRepository = new UserPostgresRepository()
  const iDGenerator = new UuidAdapter()
  const hasher = new BcryptAdapter(salt)
  return new DbCreateUserUseCase(userPostgresRepository, iDGenerator, hasher, userPostgresRepository)
}
