import {
  type ITokenService,
  type IUserRepository
} from '@/application/contracts'
import { type IGetMeUsecase, type ILogger } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import {
  type IUserTokenInfos,
  type IUser
} from '@/domain/interfaces/user.interfaces'
import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'

export class GetMeUsecase implements IGetMeUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger
  ) {}

  async execute(accessToken: string): Promise<IGetMeResponseDTO | Error> {
    this.logger.info('Init GetMeUsecase')

    const userTokenInfos: IUserTokenInfos | string =
      await this.tokenService.verifyAccessToken(accessToken)

    const payload = userTokenInfos as IUserTokenInfos
    this.logger.debug('GetMeUsecase: Token payload extracted', {
      userId: payload.userId,
      role: payload.role
    })

    this.logger.debug('GetMeUsecase: Fetching user from DB')
    const dbUser: IUser | null = await this.userRepository.getUser({
      userId: payload.userId
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
