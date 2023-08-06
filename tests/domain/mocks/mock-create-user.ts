import { CreateUser, CreateUserParams } from '../implementations'

export const mockCreateUserStub = (): CreateUser => {
  class CreateUserImplementationStub implements CreateUser {
    async execute (params: CreateUserParams): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new CreateUserImplementationStub()
}
