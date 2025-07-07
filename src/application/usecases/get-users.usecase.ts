import { type IUserRepository } from '@/application/contracts'
import { type IGetUsersUsecase, type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import {
  type ISanitezedUser,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type IGetUsersResponseDTO } from '@/domain/ports/outbounds'

export class GetUsersUsecase implements IGetUsersUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(): Promise<IGetUsersResponseDTO | Error> {
    this.logger.info('Init GetUsersUsecase')
    this.logger.debug('GetUsersUsecase: Attempting to retrieve all users')

    const dbUsers: IUser[] | null = await this.userRepository.getUsers()

    if (!dbUsers || dbUsers.length === 0) {
      this.logger.warn('GetUsersUsecase: No users found in DB')
      return new NotFoundError('No user found')
    }

    const users: ISanitezedUser[] = dbUsers.map((dbUser: IUser) => ({
      userId: dbUser.userId,
      email: dbUser.email,
      refreshToken: dbUser.refreshToken,
      role: dbUser.role
    }))

    this.logger.info('Completed GetUsersUsecase')
    this.logger.debug('GetUsersUsecase response', { count: users.length })
    return { users }
  }
}
