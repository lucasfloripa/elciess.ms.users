import { type ITokenService } from '@/application/contracts'
import { type IAuthTokenUsecase, type ILogger } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IUserTokenInfos } from '@/domain/interfaces'
import { type IAuthTokenRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthTokenResponseDTO } from '@/domain/ports/outbounds'

export class AuthTokenUsecase implements IAuthTokenUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: IAuthTokenRequestDTO
  ): Promise<IAuthTokenResponseDTO | Error> {
    this.logger.info('Init AuthTokenUsecase')
    this.logger.debug(
      'AuthTokenUsecase: Attempting to authenticate access token',
      request
    )

    const { accessToken } = request

    const userTokenInfos: IUserTokenInfos | string =
      await this.tokenService.verifyAccessToken(accessToken)

    if (userTokenInfos === 'JsonWebTokenError') {
      this.logger.warn('AuthTokenUsecase: Invalid access token format')
      return new UnauthorizedError('Invalid format token')
    }

    if (userTokenInfos === 'TokenExpiredError') {
      this.logger.warn('AuthTokenUsecase: Expired access token')
      return new UnauthorizedError('Expired token')
    }

    const payload = userTokenInfos as IUserTokenInfos
    this.logger.debug('AuthTokenUsecase: Token payload extracted', {
      userId: payload.userId,
      role: payload.role
    })

    this.logger.info('Completed AuthTokenUsecase')
    this.logger.debug('AuthTokenUsecase response', {
      userId: payload.userId,
      role: payload.role
    })
    return {
      userId: payload.userId,
      role: payload.role
    }
  }
}
