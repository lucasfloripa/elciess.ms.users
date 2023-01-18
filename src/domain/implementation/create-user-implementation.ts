export interface CreateUserImplementation {
  create: (params: CreateUserImplementationParams) => Promise<boolean>
}

export interface CreateUserImplementationParams {
  email: string
  password: string
  confirmPassword: string
}
