import { CheckUserByEmailRepository, IdGenerator, Hasher, CreateUserRepository } from '../protocols'
import { CreateUserImplementation, CreateUserImplementationParams } from '../../domain/implementation'

export class DbCreateUserUseCase implements CreateUserImplementation {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository,
    private readonly idGenerator: IdGenerator,
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create (params: CreateUserImplementationParams): Promise<boolean> {
    const { email, password } = params
    const exists = await this.checkUserByEmailRepository.checkByEmail(email)
    const isValid = false
    if (!exists) {
      const id = await this.idGenerator.generate()
      const hashedPassword = await this.hasher.hash(password)
      await this.createUserRepository.create({
        id,
        password: hashedPassword,
        email
      })
    }
    return isValid
  }
}
