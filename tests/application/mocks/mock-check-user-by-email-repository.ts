import { CheckUserByEmailRepository } from '../../../src/application/protocols'

export const mockCheckUserByEmailRepositoryStub = (): CheckUserByEmailRepository => {
  class CheckUserByEmailRepositoryStub implements CheckUserByEmailRepository {
    async checkByEmail (email: string): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new CheckUserByEmailRepositoryStub()
}
