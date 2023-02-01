import { CheckUserByEmailRepository, IdGenerator, Hasher, CreateUserRepository, EventStreamProducer } from '../../application/protocols'
import { CreateUserImplementation, CreateUserImplementationParams } from '../../domain/implementation'

export class DbCreateUserUseCase implements CreateUserImplementation {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository,
    private readonly idGenerator: IdGenerator,
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository,
    private readonly eventStreamProducer: EventStreamProducer
  ) {}

  async create (params: CreateUserImplementationParams): Promise<boolean> {
    const { email, password } = params
    const exists = await this.checkUserByEmailRepository.checkByEmail(email)
    if (exists) return false
    const id = await this.idGenerator.generate()
    const hashedPassword = await this.hasher.hash(password)
    const newUser = await this.createUserRepository.create({
      id,
      password: hashedPassword,
      email
    })
    await this.eventStreamProducer.produce('confirm-user-register', [{ key: 'user-email', value: email }])
    return newUser
  }
}
