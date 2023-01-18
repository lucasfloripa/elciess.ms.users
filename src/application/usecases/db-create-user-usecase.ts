import { CheckUserByEmailRepository } from '../protocols'
import { CreateUserImplementation, CreateUserImplementationParams } from '../../domain/implementation'

export class DbCreateUserUseCase implements CreateUserImplementation {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository
  ) {}

  async create (params: CreateUserImplementationParams): Promise<boolean> {
    const { email } = params
    const exists = await this.checkUserByEmailRepository.checkByEmail(email)
    const isValid = false
    if (exists) { /* empty */ }
    return isValid
  }
}
