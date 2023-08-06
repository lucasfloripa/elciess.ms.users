export interface CreateUser {
  execute: (params: CreateUserParams) => Promise<boolean>
}

export interface CreateUserParams {
  email: string
  password: string
}
