import {
  type IMessagerService,
  type IUserRepository
} from '@/application/contracts'
import { type IPasswordResetUsecase, type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces'
import { type IPasswordResetResponseDTO } from '@/domain/ports/outbounds'

export class PasswordResetUsecase implements IPasswordResetUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly messagerService: IMessagerService,
    private readonly logger: ILogger
  ) {}

  async execute(email: string): Promise<IPasswordResetResponseDTO | Error> {
    this.logger.info('Init PasswordResetUsecase')
    this.logger.debug(
      'PasswordResetUsecase: Attempting to reset password for email',
      { email }
    )

    const dbUser: IUser | null = await this.userRepository.getUser({
      email
    })

    if (!dbUser) {
      this.logger.warn(
        'PasswordResetUsecase: User not found for password reset'
      )
      return new NotFoundError('User not found')
    }

    this.logger.debug('PasswordResetUsecase: Sending password reset message')
    await this.messagerService.sendMessage(
      'user.notifications',
      'user.password_reset',
      email
    )

    this.logger.info('Completed PasswordResetUsecase')
    this.logger.debug(
      'PasswordResetUsecase: Password reset message sent successfully',
      { email }
    )
    return { message: 'Passord reseted' }
  }
}
