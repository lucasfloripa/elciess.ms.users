import {
  type ICacheService,
  type IUserRepository
} from '@/application/contracts'
import { type IGetMeUsecase, type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import {
  type ISanitezedUser,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'

export class GetMeUsecase implements IGetMeUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICacheService,
    private readonly logger: ILogger
  ) {}

  async execute(userId: string): Promise<IGetMeResponseDTO | Error> {
    this.logger.info('Init GetMeUsecase')
    this.logger.debug('GetMeUsecase: Checking cache for user', { userId })
    const cachedUser = await this.cacheService.get<IGetMeResponseDTO>(userId)
    if (cachedUser) {
      this.logger.info('Completed GetMeUsecase')
      this.logger.debug('GetMeUsecase: User found in cache')
      return cachedUser
    }

    this.logger.debug('GetMeUsecase: User not in cache, fetching from DB')
    const dbUser: IUser | null = await this.userRepository.getUser({ userId })

    if (!dbUser) {
      this.logger.warn('GetMeUsecase: User not found in DB')
      return new NotFoundError('User not found')
    }

    const { password, ...sanitezedUser } = dbUser
    const user: ISanitezedUser = sanitezedUser

    this.logger.debug('GetMeUsecase: Caching user data', { userId })
    await this.cacheService.set(userId, { user: sanitezedUser })

    this.logger.info('Completed GetMeUsecase')
    this.logger.debug('GetMeUsecase response', { user })
    return { user }
  }
}
