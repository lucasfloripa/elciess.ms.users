import { CreateUserImplementation, CreateUserImplementationParams } from '../../../src/domain/implementation'

export const mockCreateUserImplementationStub = (): CreateUserImplementation => {
  class CreateUserImplementationStub implements CreateUserImplementation {
    async create (params: CreateUserImplementationParams): Promise<boolean> {
      return true
    }
  }

  return new CreateUserImplementationStub()
}
