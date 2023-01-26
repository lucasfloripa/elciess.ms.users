import { CheckUserByEmailRepository, CreateUserRepository } from '../../../application/protocols'
import { PostgresHelper } from './postgres-helper'

export class UserPostgresRepository implements CheckUserByEmailRepository, CreateUserRepository {
  async create (params: CreateUserRepository.Params): Promise<boolean> {
    const user = await PostgresHelper.query(
      'INSERT INTO user(id, email, password) VALUES($1, $2, $3)', params)
    return user.rowCount > 0
  }

  async checkByEmail (email: string): Promise<boolean> {
    const exists = await PostgresHelper.query(
      'SELECT id FROM user WHERE email = $1', [email])
    return exists.rowCount > 0
  }
}
