import { User } from '../../domain/models'
import { GetUser } from '../implementations'
import { mockUserModel } from './mock-user-model'

export const mockGetUserStub = (): GetUser => {
  class GetUserImplementationStub implements GetUser {
    async execute (id: string): Promise<User> {
      return await Promise.resolve(mockUserModel())
    }
  }

  return new GetUserImplementationStub()
}
