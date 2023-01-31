import { DbGetUserUseCase } from '../../../application/usecases'
import { UserPostgresRepository } from '../../../infra/db/postgres'

export const makeDbGetUserUseCase = (): DbGetUserUseCase => {
  const userPostgresRepository = new UserPostgresRepository()
  return new DbGetUserUseCase(userPostgresRepository)
}
