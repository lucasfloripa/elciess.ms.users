import { mockUserModel } from '../../domain/mocks'
import { User } from '../../domain/models'
import { GetUserRepository } from '../../../src/application/protocols'

export const mockGetUserRepositoryStub = (): GetUserRepository => {
  class GetUserRepositoryStub implements GetUserRepository {
    async get (id: string): Promise<User | null> {
      return await Promise.resolve(mockUserModel())
    }
  }
  return new GetUserRepositoryStub()
}
