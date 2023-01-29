import { DbCreateUserUseCase } from '@src/application/usecases'
import { BcryptAdapter } from '@src/infra/cryptography'
import { UserPostgresRepository } from '@src/infra/db/postgres'
import { UuidAdapter } from '@src/infra/generators'

export const makeDbCreateUserRepository = (): DbCreateUserUseCase => {
  const salt = 12
  const userPostgresRepository = new UserPostgresRepository()
  const iDGenerator = new UuidAdapter()
  const hasher = new BcryptAdapter(salt)
  return new DbCreateUserUseCase(userPostgresRepository, iDGenerator, hasher, userPostgresRepository)
}
