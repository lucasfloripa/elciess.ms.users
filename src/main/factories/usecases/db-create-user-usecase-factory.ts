import { DbCreateUserUseCase } from '../../../application/usecases'
import { BcryptAdapter } from '../../../infra/cryptography'
import { UserPostgresRepository } from '../../../infra/db/postgres'
import { UuidAdapter } from '../../../infra/generators'
import { Kafka } from '../../../infra/message-brokers/kafka'

export const makeDbCreateUserRepository = (): DbCreateUserUseCase => {
  const salt = 12
  const userPostgresRepository = new UserPostgresRepository()
  const iDGenerator = new UuidAdapter()
  const hasher = new BcryptAdapter(salt)
  const messageBroker = new Kafka()
  return new DbCreateUserUseCase(userPostgresRepository, iDGenerator, hasher, userPostgresRepository, messageBroker)
}
