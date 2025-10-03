import { type IUserRepository } from '@/application/contracts'
import { type IDeleteUserUsecase, type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'

export class DeleteUserUsecase implements IDeleteUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(userId: string): Promise<boolean | Error> {
    this.logger.info('Init DeleteUserUsecase')
    this.logger.debug('DeleteUserUsecase: Attempting to delete user', {
      userId
    })

    const hasUserDeleted: boolean = await this.userRepository.deleteUser(userId)

    if (!hasUserDeleted) {
      this.logger.warn('DeleteUserUsecase: User not found for deletion')
      return new NotFoundError('User not found')
    }

    this.logger.info('Completed DeleteUserUsecase')
    this.logger.debug('DeleteUserUsecase user deleted', { userId })
    return hasUserDeleted
  }
}
