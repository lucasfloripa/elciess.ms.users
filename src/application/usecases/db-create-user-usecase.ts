import { CheckUserByEmailRepository, IdGenerator } from '../protocols'
import { CreateUserImplementation, CreateUserImplementationParams } from '../../domain/implementation'

export class DbCreateUserUseCase implements CreateUserImplementation {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async create (params: CreateUserImplementationParams): Promise<boolean> {
    const { email } = params
    const exists = await this.checkUserByEmailRepository.checkByEmail(email)
    const isValid = false
    if (!exists) {
      await this.idGenerator.generate()
    }
    return isValid
  }
}
