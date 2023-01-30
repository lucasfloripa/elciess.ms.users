import { DbGetUserUseCase } from '@src/application/usecases'
import { UserPostgresRepository } from '@src/infra/db/postgres'

export const makeDbGetUserUseCase = (): DbGetUserUseCase => {
  const userPostgresRepository = new UserPostgresRepository()
  return new DbGetUserUseCase(userPostgresRepository)
}
