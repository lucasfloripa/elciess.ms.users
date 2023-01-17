import { User } from '../../../src/domain/models'
import { CreateUserImplementation, CreateUserImplementationParams } from '../../../src/domain/implementation'
import { mockUserModel } from '../mocks'

export const mockCreateUserImplementationStub = (): CreateUserImplementation => {
  class CreateUserImplementationStub implements CreateUserImplementation {
    async create (params: CreateUserImplementationParams): Promise<User> {
      return mockUserModel()
    }
  }

  return new CreateUserImplementationStub()
}
