import { User } from 'domain/models'

export interface CreateUserImplementation {
  create: (params: CreateUserImplementationParams) => Promise<User | null>
}

export interface CreateUserImplementationParams {
  email: string
  password: string
  confirmPassword: string
}
