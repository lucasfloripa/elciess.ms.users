import { type ITokenService } from '@/application/contracts'
import { type IAuthenticationUsecase, type ILogger } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IUserTokenInfos } from '@/domain/interfaces'
import { type IAuthenticationRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthenticationResponseDTO } from '@/domain/ports/outbounds'

export class AuthenticationUsecase implements IAuthenticationUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: IAuthenticationRequestDTO
  ): Promise<IAuthenticationResponseDTO | Error> {
    this.logger.info('Init AuthenticationUsecase')
    this.logger.debug(
      'AuthenticationUsecase: Attempting to authenticate access token',
      request
    )

    const { accessToken } = request

    const userTokenInfos: IUserTokenInfos | string =
      await this.tokenService.verifyAccessToken(accessToken)

    if (userTokenInfos === 'JsonWebTokenError') {
      this.logger.warn('AuthenticationUsecase: Invalid access token format')
      return new UnauthorizedError('Invalid format token')
    }

    if (userTokenInfos === 'TokenExpiredError') {
      this.logger.warn('AuthenticationUsecase: Expired access token')
      return new UnauthorizedError('Expired token')
    }

    const payload = userTokenInfos as IUserTokenInfos
    this.logger.debug('AuthenticationUsecase: Token payload extracted', {
      userId: payload.userId,
      role: payload.role
    })

    this.logger.info('Completed AuthenticationUsecase')
    this.logger.debug('AuthenticationUsecase response', {
      userId: payload.userId,
      role: payload.role
    })
    return {
      userId: payload.userId,
      role: payload.role
    }
  }
}
