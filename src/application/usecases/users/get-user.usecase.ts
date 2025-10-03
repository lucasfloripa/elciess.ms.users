import { type IUserRepository } from '@/application/contracts'
import { type IGetUserUsecase, type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import {
  type ISanitezedUser,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type IGetUserRequestDTO } from '@/domain/ports/inbounds'
import { type IGetUserResponseDTO } from '@/domain/ports/outbounds'

export class GetUserUsecase implements IGetUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: IGetUserRequestDTO
  ): Promise<IGetUserResponseDTO | Error> {
    this.logger.info('Init GetUserUsecase')
    this.logger.debug('GetUserUsecase: Attempting to retrieve user by ID', {
      userId: request.id
    })

    const dbUser: IUser | null = await this.userRepository.getUser({
      userId: request.id
    })

    if (!dbUser) {
      this.logger.warn('GetUserUsecase: User not found in DB', {
        userId: request.id
      })
      return new NotFoundError('User not found')
    }

    const { password, ...sanitezedUser } = dbUser

    const user: ISanitezedUser = sanitezedUser

    this.logger.info('Completed GetUserUsecase')
    this.logger.debug('GetUserUsecase response', { user })
    return { user }
  }
}
