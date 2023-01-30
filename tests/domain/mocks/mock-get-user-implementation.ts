import { User } from 'domain/models'
import { GetUserImplementation } from '../../../src/domain/implementation'
import { mockUserModel } from './mock-user-model'

export const mockGetUserImplementationStub = (): GetUserImplementation => {
  class GetUserImplementationStub implements GetUserImplementation {
    async getUser (id: string): Promise<User> {
      return await Promise.resolve(mockUserModel())
    }
  }

  return new GetUserImplementationStub()
}
