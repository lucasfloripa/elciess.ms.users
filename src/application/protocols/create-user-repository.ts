export interface CreateUserRepository {
  create: (params: CreateUserRepository.Params) => Promise<boolean>
}

export namespace CreateUserRepository {
  export interface Params {
    id: string
    email: string
    hashedPassword: string
  }
}
