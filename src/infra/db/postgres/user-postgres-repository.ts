import { CheckUserByEmailRepository, CreateUserRepository } from '@src/application/protocols'
import { PostgresHelper } from './postgres-helper'

export class UserPostgresRepository implements CheckUserByEmailRepository, CreateUserRepository {
  async create (params: CreateUserRepository.Params): Promise<boolean> {
    const user = await PostgresHelper.query(
      'INSERT INTO users(id, password, email) VALUES($1, $2, $3)', Object.values(params))
    return user.rowCount > 0
  }

  async checkByEmail (email: string): Promise<boolean> {
    const exists = await PostgresHelper.query(
      'SELECT id FROM users WHERE email = $1', [email])
    return exists.rowCount > 0
  }
}
