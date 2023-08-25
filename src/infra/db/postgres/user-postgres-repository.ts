import { PostgresHelper } from './postgres-helper'
import { CheckUserByEmailRepository, CreateUserRepository, GetUserRepository, GetUserByEmail } from '../../../application/protocols'
import { User } from '../../../domain/models'

export class UserPostgresRepository implements CheckUserByEmailRepository, CreateUserRepository, GetUserRepository, GetUserByEmail {
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

  async getByEmail (email: string): Promise<User | null> {
    const user = await PostgresHelper.query(
      'SELECT * FROM users WHERE email = $1', [email])
    return user.rows[0]
  }
}
