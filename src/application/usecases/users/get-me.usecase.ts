import { type IUserRepository } from '@/application/contracts'
import { type IGetMeUsecase, type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IUser } from '@/domain/interfaces/user.interfaces'
import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'

export class GetMeUsecase implements IGetMeUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  async execute(userId: string): Promise<IGetMeResponseDTO | Error> {
    this.logger.info('Init GetMeUsecase')

    this.logger.debug('GetMeUsecase: Fetching user from DB')
    const dbUser: IUser | null = await this.userRepository.getUser({
      userId
    })
    if (!dbUser) {
      this.logger.warn('GetMeUsecase: User not found in DB')
      return new NotFoundError('User not found')
    }

    this.logger.info('Completed GetMeUsecase')
    this.logger.debug('GetMeUsecase response', {
      email: dbUser.email,
      role: dbUser.role
    })

    return {
      email: dbUser.email,
      role: dbUser.role
    }
  }
}
