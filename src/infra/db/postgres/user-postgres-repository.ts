import { PostgresHelper } from './postgres-helper'
import { CheckUserByEmailRepository, CreateUserRepository } from '../../../application/protocols'
import { GetUserRepository } from '../../../application/protocols/get-user-repository'
import { User } from '../../../domain/models'

export class UserPostgresRepository implements CheckUserByEmailRepository, CreateUserRepository, GetUserRepository {
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

  async get (id: string): Promise<User> {
    const user = await PostgresHelper.query(
      'SELECT * FROM users WHERE id = $1', [id])
    return user.rows[0]
  }
}
