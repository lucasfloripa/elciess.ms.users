import { type User } from '../../entities'

export interface IAuthUserResponse {
  token: string
}

export interface ICreateUserResponse {
  user: Omit<User, 'password'>
}
