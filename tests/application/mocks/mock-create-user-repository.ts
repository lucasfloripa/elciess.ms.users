import { CreateUserRepository } from '../../../src/application/protocols'

export const mockCreateUserRepositoryStub = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async create (params: CreateUserRepository.Params): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new CreateUserRepositoryStub()
}
