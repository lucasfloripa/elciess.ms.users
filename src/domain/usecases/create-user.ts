import { User } from 'domain/models'

export interface CreateUser {
  create: (params: CreateUserParams) => Promise<User>
}

export interface CreateUserParams {
  email: string
  password: string
  confirmPassword: string
}

export interface CreaterUserResponse {
  user: User
}
