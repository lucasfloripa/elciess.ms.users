import { User } from 'domain/models'

export interface CreateUserImplementation {
  create: (params: CreateUserImplementationParams) => Promise<User>
}

export interface CreateUserImplementationParams {
  email: string
  password: string
  confirmPassword: string
}

export interface CreaterUserImplementationResponse {
  user: User
}
