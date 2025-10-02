import { type IUserRepository } from '@/application/contracts'
import { type ILogger, type ICreateUserUsecase } from '@/domain/contracts'
import { User } from '@/domain/entities'
import { EmailInUseError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces/user.interfaces'
import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '@/domain/ports/outbounds'

export class CreateUserUsecase implements ICreateUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: ICreateUserRequestDTO
  ): Promise<ICreateUserResponseDTO | Error> {
    this.logger.info('Init CreateUserUsecase')
    this.logger.debug('CreateUserUsecase: Checking if user exists', {
      email: request.email
    })
    const userExists: IUser | null = await this.userRepository.getUser({
      email: request.email
    })

    if (userExists) {
      this.logger.warn('CreateUserUsecase: Email already in use')
      return new EmailInUseError()
    }

    this.logger.debug('CreateUserUsecase: Creating new user entity')
    const user: User = await User.create(request)

    this.logger.debug('CreateUserUsecase: Saving user to repository', {
      userId: user.userId
    })
    await this.userRepository.save(user.toPersistence())

    this.logger.info('Completed CreateUserUsecase')
    this.logger.debug('CreateUserUsecase response', {
      user: user.toReturn()
    })
    return { user: user.toReturn() }
  }
}
