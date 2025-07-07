import { type IUserRepository } from '@/application/contracts'
import { type ILogoutUsecase, type ILogger } from '@/domain/contracts'
import { UserEnums } from '@/domain/enums'
import { NotFoundError } from '@/domain/errors'
import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'

export class LogoutUsecase implements ILogoutUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(userId: string): Promise<ILogoutResponseDTO | Error> {
    this.logger.info('Init LogoutUsecase')
    this.logger.debug('LogoutUsecase: Attempting to log out user', { userId })

    const didUserLogout: UserEnums = await this.userRepository.logout(userId)

    if (didUserLogout === UserEnums.USER_NOT_FOUND) {
      this.logger.warn('LogoutUsecase: User not found for logout')
      return new NotFoundError('User not found')
    }

    if (didUserLogout === UserEnums.ALREADY_LOGGED_OUT) {
      this.logger.info('LogoutUsecase: User was already logged out')
      return { message: 'User was already logged out.' }
    }

    this.logger.info('Completed LogoutUsecase')
    this.logger.debug('LogoutUsecase: User successfully logged out')
    return { message: 'User logged out' }
  }
}
