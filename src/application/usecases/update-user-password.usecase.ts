import { type IUserRepository } from '@/application/contracts'
import {
  type IUpdateUserPasswordUsecase,
  type ILogger
} from '@/domain/contracts'
import { UserEnums } from '@/domain/enums'
import { ConflictError, NotFoundError } from '@/domain/errors'
import { type IUpdateUserPasswordRequestDTO } from '@/domain/ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '@/domain/ports/outbounds'
import { Password } from '@/domain/value-objects'

export class UpdateUserPasswordUsecase implements IUpdateUserPasswordUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: IUpdateUserPasswordRequestDTO
  ): Promise<IUpdateUserPasswordResponseDTO | Error> {
    this.logger.info('Init UpdateUserPasswordUsecase')
    this.logger.debug(
      'UpdateUserPasswordUsecase: Attempting to update password for user',
      { userId: request.userId }
    )

    const { userId, password, newPassword } = request

    if (password === newPassword) {
      this.logger.warn(
        'UpdateUserPasswordUsecase: Actual password equals new password'
      )
      return new ConflictError('Actual password equals newPassword')
    }

    this.logger.debug(
      'UpdateUserPasswordUsecase: Hashing new password for user',
      { userId }
    )
    const hashedPassword = await Password.create(newPassword)

    this.logger.debug(
      'UpdateUserPasswordUsecase: Calling repository to update password',
      { userId }
    )
    const didUpdatePassword = await this.userRepository.updateUserPassword(
      userId,
      hashedPassword.value()
    )

    if (didUpdatePassword === UserEnums.USER_NOT_FOUND) {
      this.logger.warn(
        'UpdateUserPasswordUsecase: User not found for password update'
      )
      return new NotFoundError('User not found')
    }

    this.logger.info('Completed UpdateUserPasswordUsecase')
    this.logger.debug(
      'UpdateUserPasswordUsecase: Password updated successfully',
      { userId }
    )
    return { message: 'Password has updated' }
  }
}
