import { CheckUserByEmailRepository } from '../protocols'
import { User } from '../../domain/models'
import { CreateUserImplementation, CreateUserImplementationParams } from '../../domain/implementation'

export class DbCreateUserUseCase implements CreateUserImplementation {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository
  ) {}

  async create (params: CreateUserImplementationParams): Promise<User | null> {
    const { email } = params
    await this.checkUserByEmailRepository.checkByEmail(email)
    return null
  }
}
