import { GetUserRepository } from '@src/application/protocols/get-user-repository'
import { GetUserImplementation } from '@src/domain/implementation'
import { User } from '@src/domain/models'

export class DbGetUserUseCase implements GetUserImplementation {
  constructor (
    private readonly getUserRepository: GetUserRepository
  ) {}

  async getUser (id: string): Promise<User | null> {
    return await this.getUserRepository.get(id)
  }
}
