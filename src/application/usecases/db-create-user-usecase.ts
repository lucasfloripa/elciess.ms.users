import { CheckUserByEmailRepository, IdGenerator, Hasher } from '../protocols'
import { CreateUserImplementation, CreateUserImplementationParams } from '../../domain/implementation'

export class DbCreateUserUseCase implements CreateUserImplementation {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository,
    private readonly idGenerator: IdGenerator,
    private readonly hasher: Hasher
  ) {}

  async create (params: CreateUserImplementationParams): Promise<boolean> {
    const { email, password } = params
    const exists = await this.checkUserByEmailRepository.checkByEmail(email)
    const isValid = false
    if (!exists) {
      await this.idGenerator.generate()
      await this.hasher.hash(password)
    }
    return isValid
  }
}
