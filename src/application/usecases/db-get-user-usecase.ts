import { GetUserRepository } from '../protocols/get-user-repository'
import { GetUser } from '../../domain/implementations'
import { User } from '../../domain/models'

export class DbGetUserUseCase implements GetUser {
  constructor (
    private readonly getUserRepository: GetUserRepository
  ) {}

  async execute (id: string): Promise<User | null> {
    return await this.getUserRepository.get(id)
  }
}
